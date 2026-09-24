---
title: 'GPN24 Log: Matrix Federation, Rust on the GPU, and a Car That Died in Essen'
date: '2026-06-08'
description: 'My recap of the 24th Gulaschprogrammiernacht in Karlsruhe: federated comms, Rust compiling all the way down to the GPU, de-Spotifying your music, and a car that gave up on the drive home.'
tags: ['gpn24', 'matrix', 'rust', 'security', 'self-hosting']
published: true
---

Every summer means one thing: **Gulaschprogrammiernacht**. This year that meant four days (June 4th to 7th) back in Karlsruhe for the **GPN24**, Entropia's "Gulasch at the Scale of Chaos", run out of the ZKM and the HfG. More gulasch than should be physically possible, a Hackcenter that never sleeps, and the same rule as at Congress: the talks are the excuse, the hallway is the point.

Once again my corner was the **:3 maf1a assembly**, and once again the best parts happened between the sessions rather than inside them.

![GPN24 Hackcenter](/blog/images/gpn24-header.jpg)
_The Hackcenter at GPN24, mid-week: tables of people, laptops, and the occasional gulasch stain._

## 1. Comms you don't have to trust anyone with

The talk that stayed with me longest was **"Communication without Borders: Cross-Platform VoIP"**, an open-source framework for bridging a centralized platform like Discord into the federated Matrix world, so nobody has to pick a side to keep talking to their friends. Real-time audio, presence and identity mapping, all the awkward tradeoffs federation forces on you, walked through live.

It hit close to home because it's the same protocol I spent months elbow-deep in at **Dataflow Security**, where I built a local search engine over an internal Matrix-based comms system. I'd been looking at Matrix from the indexing side; watching someone wrestle it from the client side made a few of my own assumptions feel small, which is the whole reason I go to talks.

The other trust puzzle was **"Gaslight, Gatekeep, Girlboss: Breaking Minecraft's Decentralised Chat Reporting System"**. When you can't trust the client _or_ the server, a reporting system that isn't trivially abused is a nightmare to get right. Seven exploits later, it's a clean lesson that "decentralized" and "abusable" are usually the same sentence wearing different hats.

> [The full GPN24 program is recorded on media.ccc.de](https://media.ccc.de/c/gpn24)

## 2. Rust, all the way down to the GPU

I went to **"Writing GPU shaders in Rust"** for one specific reason: this portfolio renders its ASCII hero through hand-written GLSL on a WebGL2 pipeline, and I keep wondering how much of that could live in Rust instead.

The talk walked through **rust-gpu**, compiling embedded Rust to SPIR-V, then to WGSL, then running it on the web, and where that beats writing shaders directly. The idea of shipping ordinary Rust to the GPU is still doing something unhinged in my head, and it's firmly in the backlog now. Rust was everywhere this year anyway; a **"Making games in Rust with Bevy"** intro on the same schedule made the "concurrency by default" pitch hard to ignore for the kind of real-time toys I like to build.

## 3. De-Spotify yourself

**"De-Spotify Yourself"** was the talk I almost skipped and am most glad I didn't. It's about actually leaving music and podcast streaming: the reasons to go, and the tooling that makes it bearable instead of a second job.

I'm deep in that world already. I run my own media server (Jellyfin and the usual friends around it), so half the talk was me nodding along and the other half was me stealing ideas for the next weekend. The full story of how I ended up there, from moving into my first own apartment to building the homeserver under it, is [written up here](/blog/first-apartment-homenetwork-and-homeserver). For now, the short version: de-Spotifying is easier than people think, and much harder than the marketing of "just use an app" wants you to believe.

## 4. The security track

**"Pwning Bossware for Fun and Ethics"** (a week of research, 15 CVEs, employee-surveillance software) and **"Common sense in der IT-Sicherheit"** (do you really have to patch every CVE the hour it drops?) were exactly the pair I needed.

Doing R&D at a cybersecurity company means the "just apply every update immediately" panic is a daily pressure. The common-sense talk was a good counterweight: triage is the actual skill, and reacting to everything is the same as reacting to nothing.

## 5. The people

My boss from **Dataflow** knew I was heading to the GPN, so we'd arranged to meet up on site, and it was genuinely great to swap a few hours with someone I usually only see in tickets and standups. Between that and friends who came out from all across Germany, the :3 maf1a corner turned into a proper reunion. Same lesson as Congress: the code is the excuse, the hallway track is the point.

## 6. The drive home

Then the car. On the drive back, right after we reached Essen to drop off some friends, it gave up. Not "sputter, swear at it, limp to a garage" gave up: **totaled**.

![The car, in Essen](/blog/images/gpn24-brokencar.jpg)
_The Polo, having decided it was done. Essen, on the way home._

Which is a strange way to end an otherwise perfect week. You spend four days building and breaking things for fun, then go to break one last thing on the way home and it turns out to be your own car. The only silver lining is timing: it died with people around me and a short train ride from home, not somewhere in the middle of the autobahn at 2 AM. And it's the people from this week who made a totaled car on the way home survivable.

## Summary

GPN24 was gulasch, Tschunk, federation, Rust tooling, and a masterclass in self-hosted pain, bookended by a car that will never start again. At least it died in the right city.

Recharged, and already planning what to break (and rebuild) before the next one.

**See you at GPN25!**
