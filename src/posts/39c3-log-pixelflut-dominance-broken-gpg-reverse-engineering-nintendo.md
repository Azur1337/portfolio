---
title: '39c3 Log: Pixelflut Dominance, Broken GPG & Reverse Engineering Nintendo'
date: '2025-12-30'
description: 'My recap of the 39th Chaos Communication Congress. Dominating the Pixelflut wall with Rust, dissecting critical GPG bugs, and starting a Nintendo DS multiplayer server project.'
tags: ['security', 'rust', '39c3', 'pixelflut', 'reverse-engineering']
published: true
---

The end of the year means one thing: **Congress**.
This year, I spent the days between December 27th and 30th at the CCH in Hamburg for the **39c3** (Power Cycles).

My home base was the **:3 maf1a assembly**. For me, Congress isn't just about the talks - it's about the "Hallway Track", the chaotic creativity, and building things that serve absolutely no purpose other than being cool (and fast).

![39c3 Exterior View](/blog/images/39c3-exterior.jpg)
_The CCH in its full glory_

## 1. Dominating Pixelflut with Rust

One of the highlights at our assembly was the **Pixelflut** battle. For the uninitiated: Pixelflut is a collaborative canvas where you send pixel commands via TCP. The only limit is your bandwidth and code efficiency.

We didn't just participate; we aimed to dominate. Using a custom **Rust-based client**, we managed to flood the Breakwater server and hold our ground for the last two days.

![Pixelflut :3 maf1a](/blog/images/39c3-pixelflut.jpg)
_Our banner claiming the wall._

This was a perfect real-world benchmark for Rust's async networking capabilities. Pushing gigabits of pixel data without GC pauses is exactly why I love this language.

## 2. The GPG Meltdown: "To sign or not to sign"

On the serious side, the talk **"To sign or not to sign: Practical vulnerabilities in GPG & friends"** was the most impactful session for me - especially since it was given by friends of mine.

They demonstrated how subtle implementation bugs in widely used OpenPGP libraries allow attackers to forge signatures. Seeing them dismantle the trust we place in these libraries live on stage was a stark reminder: **"Using a library" isn't enough.** We need to audit dependencies, especially when crypto is involved.

> [Watch the talk here](https://media.ccc.de/v/39c3-to-sign-or-not-to-sign-practical-vulnerabilities-i)

## 3. Project "NinCCC": Reverse Engineering the Nintendo DS

The best projects start with random conversations at 3 AM.
I spent time talking with a friend about the Nintendo DS local multiplayer protocols. This sparked a new project: **NinCCC**.

We are attempting to write a custom **local multiplayer server in Rust**. It involves dissecting the proprietary Wi-Fi protocol of the DS and emulating the handshake logic. It's early days, but you can track our progress here:

> **Repo:** [git.gay/67/ninccc](https://git.gay/67/ninccc)

## 4. Other Highlights

- **BitUnlocker:** A deep dive into extracting BitLocker keys via Windows Recovery. A scary reminder that physical access is root access.
- **CSS Clicker Training:** Building a game engine purely in CSS. A mind-bending abuse of the browser's rendering engine.

## Summary

Hamburg provided the perfect backdrop. Staying in St. Pauli with a view of the Bunker and Millerntor Stadium added to the vibe, but the real magic happened inside the CCH.

Congress recharged my engineering batteries. Whether it's optimizing TCP packets for Pixelflut or digging into legacy protocols for the DS - I'm ready for a year of building (and breaking) systems.

**See you at 40c3!**
