---
title: 'First Apartment: A Home Network, a Homeserver, and the Fight to Make It Just Work'
date: '2026-05-22'
description: 'Moving into my first own apartment meant designing a home network and a homeserver from scratch: the boring questions nobody thinks about, segmenting guest/work/media traffic, exposing Jellyfin and a Minecraft server safely, and keeping the whole thing from becoming a second job.'
tags: ['self-hosting', 'networking', 'nixos', 'jellyfin', 'smart-home']
published: true
---

I moved into my first own apartment, and the first real project I set up in it wasn't furniture. It was a network.

That sounds like a flex until you realize what it actually is: a few months of reading datasheets at 1 AM, arguing with myself about VLANs, and slowly turning a room full of boxes into something that mostly just works. This is the whole arc: the apartment, the network, the server, the media stack, and the long tail of smart-home nonsense that keeps growing.

The through-line is the same as everything I build: I want it to be a _just working thing_, not a second job. If a setup needs me babysitting it every weekend, it has failed, no matter how clever it is.

## 1. The boring questions nobody thinks about

Before any of the fun stuff, there's a layer of decisions that feels tedious until it's the thing holding everything else up. What internet plan do I actually get? Which provider, and what connection do they even offer in this building? Fiber, or cable, or the sad copper option that's "fast enough"?

Then the physical layer, which is the part a rental makes weird. I'm not opening walls, and the ethernet drops in the building aren't a decision I get to make: they're either there or they aren't, and I'm working with whatever the landlord left behind. So the question flips from "where do I want the drops" to "what am I actually stuck with, and how do I make it enough?" How many usable drops are there, and where? If the desk I want to sit at has no drop, do I run a cable across the floor, get a short powerline link, or just accept wifi for that one machine? And the router: do I take the one the provider hands me, or do I want my own and put theirs in bridge mode?

None of this is exciting. All of it is load-bearing. Get the connection type wrong and every bandwidth question downstream is moot. Get the physical layer wrong and the "proper 1-cable setup" I want later is impossible, which is exactly why the rental constraint matters: I can't fix the cabling after the fact, so I have to design around it, not through it. This is where the project actually starts, not with the server.

## 2. Planning the network before picking a switch

The mistake I kept almost making was reaching for a switch first. You can't pick a switch until you know what you're trying to do, because the switch has to fit the plan, not the other way around.

So the plan comes first. How many ports do I actually need, per segment, plus headroom for the things I haven't bought yet? How much bandwidth does each segment realistically need? And what features do the ports and the switch itself have to support, because "it has eight ports" is not a specification.

The reason this matters for me is that I don't want one flat network. I want separate ones:

- a **guest** network, isolated from everything, for the friends who stay over and need wifi;
- my **private** network, for my own machines and the homeserver;
- a **work** network, completely separate, because that traffic has to be handled very differently and I don't want it sharing a broadcast domain with my personal stuff.

That last one is the one that changes the hardware. It's not just "put work on a different SSID." I need the work machines, and the hardware I use to protect them, to live on a segment that my private network and the guest network can't casually reach. So the switch, the router, and whatever does the segmentation all have to actually support it, and that constraint is what drives the rest of the purchase list.

```
                        ┌─────────────────────────────┐
                        │            WAN              │
                        │   (provider, bridge mode)   │
                        └──────────────┬──────────────┘
                                       │
                              ┌────────┴────────┐
                              │      ROUTER      │  firewall + segmentation
                              │  (VLAN-aware)    │
                              └────────┬────────┘
             ┌─────────────────────────┼─────────────────────────┐
             │                         │                         │
   ┌─────────┴─────────┐     ┌─────────┴─────────┐     ┌─────────┴─────────┐
   │     GUEST         │     │     PRIVATE       │     │      WORK         │
   │  (isolated wifi)  │     │  (wired + wifi)   │     │  (wired, locked)  │
   │                   │     │                   │     │                   │
   │  friends' laptops │     │  ┌─────────────┐  │     │  work laptop      │
   │  no lateral access│     │  │  HOMESERVER │  │     │  + security HW    │
   │                   │     │  │  (NixOS)    │  │     │  no lateral access│
   └───────────────────┘     │  └──────┬──────┘  │     └───────────────────┘
                             │         │         │
                             │   ┌─────┴──────┐  │
                             │   │  exposure  │  │  only these two doors,
                             │   │  (auth'd)  │  │  both behind auth
                             │   ├────────────┤  │
                             │   │  Jellyfin  │  │
                             │   │  Minecraft │  │
                             │   └────────────┘  │
                             └───────────────────┘

   a stranger scanning the public IP finds two authenticated doors
   and nothing else, not a map of the apartment
```

## 3. The homeserver, and how to expose it without opening a hole

The homeserver is the thing the whole network exists to serve. It runs the media stack, it's the thing I want to reach from outside, and it's the reason "somewhat publicly accessible while staying secure" is a real requirement instead of a slogan.

The two concrete cases are:

- hosting a **Minecraft server** for friends, which means a port that's reachable from the internet but only usable by people I've given access to;
- sharing **Jellyfin** with friends and friends only, which means the same idea one level up: reachable, authenticated, and not a wide-open door to the rest of the box.

The naive version of both is "forward the port and hope." The version I actually want is the boring one: the server sits on its own segment, only the specific service is exposed, it sits behind authentication, and everything else on the box is not reachable from the internet at all. The goal is that a stranger scanning my IP finds two authenticated doors and nothing else, not a map of the apartment.

## 4. The media stack, and where the music actually comes from

This is the part that's easiest to undersell. The stack is the usual suspects: **Jellyfin** for serving, **Radarr** and **Sonarr** for the movies and shows, **Lidarr** for the music, and the storage and indexing glue around them. (Plex is the thing I'm _not_ running, for reasons that are mostly about not wanting a company's cloud in the middle of my own files.)

The music is where it gets interesting, because "where do I get my music from" is a question with a less clean answer than the movies. In a world this saturated with streaming, actually getting your hands on the files is genuinely hard. High-quality FLAC in particular is scarce, the catalogs that have it are locked behind subscriptions that don't let you keep what you download, and the harder it gets the more niche the artist, because the stuff I actually listen to is often the stuff no streaming catalog bothers to carry in any quality at all. So "I just stream it" stops being an answer the moment you want the file itself, lossless, on your own shelf, available offline and shareable with the people you trust. I ended up writing my own tool for it: [meowsic.rs](https://git.gay/420/meowsic.rs), a Rust project that pulls music from Tidal so the library Lidarr and Jellyfin serve is actually the stuff I already pay for and listen to, in the quality I want.

And then the sharing problem again, because the whole point is that friends can get in and strangers can't. Same shape as the Minecraft and Jellyfin cases: reachable, authenticated, scoped. The media stack is just the largest instance of a pattern I keep hitting, which is that "share this with people I trust" is a networking and auth problem wearing a media costume.

## 5. Making it a just working thing, not a second job

Here's the part that decides whether the whole project is a success. A self-hosted stack has a failure mode where it becomes a part-time job: something breaks, you spend an evening on it, it breaks again in a different way, and slowly the hobby you were running for fun is now maintenance you have to schedule.

The counter to that is making the boring parts automatic and the whole thing declarative. Which is why the server runs on **NixOS with flakes**: the configuration is code, it's versioned, and "what is this box supposed to look like" has a single source of truth I can rebuild from instead of a set of half-remembered clicks. When something breaks, the answer is "reconcile to the declared state," not "let me remember what I did in March."

The same idea shows up everywhere else in the apartment:

- a **network-wide ad blocker**, so every device on the network gets the same filtering without me configuring each one;
- **Smart TV shenanigans**: custom firmware and a custom YouTube app on the TV, because the stock experience is a hostage situation;
- **custom configs** for whatever needs them, the router, the switch, the boxes, whatever actually takes a config file;
- a **proper 1-cable setup** for switching keyboard, mouse, headphones, and monitors between the PC, the private laptop, and the work laptop, with a docking station that makes "which machine am I on" a single-cable decision instead of a tangle.

The test for all of it is the same: after I set it up, does it need me? The ad blocker should never need me. The 1-cable setup should never need me. The server should only need me when I want to change something, not when something drifted.

## 6. Wifi in every corner, and the smart home long tail

Two more layers that are less "networking" and more "apartment."

First, **wifi in every corner**. A single router in the middle of the apartment is not enough, and I don't want dead zones in the one room I actually sit in. So this is a coverage problem: how many access points, where, and how do they stay on the same seamless network as the wired core instead of becoming a second, weaker network.

Second, the **smart home** stuff, which is the long tail that keeps growing:

- radiators that turn off automatically when I open a window;
- a light that comes on when I get up to go to the toilet at 2 AM, without me having to find a switch in the dark;
- every device turning off when I leave the house, with proper power management so the apartment isn't a small power plant at night.

None of this is hard individually. The hard part is that it's a hundred small automations that have to coexist without fighting each other, and that's the same "just working thing" test as everything else.

## 7. Doing all of this without spending thousands

The constraint that ties the whole thing together: this has to be cheap. Not "cheap" as in "I'll figure it out later," but cheap as a real budget, because the naive version of a segmented, well-cabled, fully self-hosted apartment is several thousand euros of gear, and I don't want to spend that on a first apartment.

So every purchase in this post is being made against that budget. The segmentation, the cabling, the server, the access points, the smart home: all of it has to earn its place in a total that I'd be comfortable actually paying. The cleverness is in the ordering and the reuse, in buying the one good switch instead of three mediocre ones, in running the media stack on hardware I already have, in making the declarative config do the work that would otherwise be a paid convenience.

That's the whole project in one sentence: a first apartment, turned into a network and a server and a media stack and a smart home, on a budget, in a way that mostly just works and doesn't need me.

The details of each piece, the actual hardware and the actual configs, are the part I'm still pulling together. This is the shape of it; the specifics are in progress.
