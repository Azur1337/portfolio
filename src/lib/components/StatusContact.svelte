<script lang="ts">
	import { status } from '$lib/data/status';
	import { email } from '$lib/email';
	import Reveal from '$lib/components/Reveal.svelte';

	const pad = (n: number) => String(n).padStart(3, '0');
</script>

<section id="offer" class="bg-off-white py-72 text-black lg:py-160">
	<div class="grid grid-cols-1 gap-x-16 gap-y-64 px-16 lg:grid-cols-12 lg:px-80">
		<Reveal class="lg:col-span-6 lg:row-start-1">
			<h2 class="text-headline-10 font-medium text-balance whitespace-pre-line">
				{status.headline.join('\n')}
			</h2>
		</Reveal>
		<div
			class="flex items-center gap-12 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:self-end lg:justify-self-end"
		>
			<p class="font-mono text-caption-10 text-dark-grey uppercase">
				Currently at Hochschule Bochum · B.Sc. Computer Science
			</p>
		</div>

		<div class="grid grid-cols-1 gap-16 lg:col-span-12 lg:row-start-2 lg:grid-cols-2">
			<div class="relative isolate flex h-full flex-col text-white">
				<div class="flex flex-col gap-12 rounded-8 bg-black p-16 lg:p-32">
					<div class="flex items-center justify-between gap-12 font-mono text-caption-10 uppercase">
						<span
							class="inline-flex w-fit shrink-0 items-center rounded-4 bg-current/10 px-6 py-4 leading-none tracking-wide"
							>{status.chip}</span
						>
						<span
							class="inline-flex w-fit shrink-0 items-center gap-8 rounded-4 bg-current/10 px-6 py-4 leading-none tracking-wide"
						>
							<span aria-hidden="true" class="relative flex size-6">
								<span
									class="absolute inline-flex size-6 animate-status-ping rounded-full bg-accent motion-reduce:hidden"
								></span>
								<span class="relative inline-flex size-6 rounded-full bg-accent"></span>
							</span>
							{status.status}
						</span>
					</div>
					<span class="inline-flex text-headline-20 leading-none">{status.statusWord}</span>
				</div>
				<div aria-hidden="true" class="flex justify-center">
					<div class="h-4 w-[90%] border-x border-black"></div>
				</div>
				<ul
					class="flex flex-1 flex-col gap-4 rounded-8 bg-black p-16 font-mono text-caption-10 uppercase lg:p-32"
				>
					{#each status.looking as line, i (line.text)}
						<li class="flex gap-24">
							<span class="text-dark-grey tabular-nums">{pad(i + 1)}</span>
							<span class="text-ghost-grey">{line.text}</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="relative isolate flex h-full flex-col text-white">
				<div class="flex flex-col gap-12 rounded-8 bg-black p-16 lg:p-32">
					<div class="flex items-center justify-between gap-12 font-mono text-caption-10 uppercase">
						<span
							class="inline-flex w-fit shrink-0 items-center rounded-4 bg-current/10 px-6 py-4 leading-none tracking-wide"
							>{status.contactChip}</span
						>
						<span
							class="inline-flex w-fit shrink-0 items-center gap-8 rounded-4 bg-current/10 px-6 py-4 leading-none tracking-wide"
						>
							<span aria-hidden="true" class="relative flex size-6">
								<span
									class="absolute inline-flex size-6 animate-status-ping rounded-full bg-accent motion-reduce:hidden"
								></span>
								<span class="relative inline-flex size-6 rounded-full bg-accent"></span>
							</span>
							RESPONDS FAST
						</span>
					</div>
					<span class="inline-flex text-headline-20 leading-none">{status.contactWord}</span>
				</div>
				<div aria-hidden="true" class="flex justify-center">
					<div class="h-4 w-[90%] border-x border-black"></div>
				</div>
				<ul
					class="flex flex-1 flex-col gap-4 rounded-8 bg-black p-16 font-mono text-caption-10 uppercase lg:p-32"
				>
					<li class="flex gap-24">
						<span class="text-dark-grey tabular-nums">001</span>
						<a
							href="mailto:{email}"
							class="text-ghost-grey underline decoration-dashed decoration-from-font underline-offset-4 transition-colors hover:text-white"
							>{email}</a
						>
					</li>

					<li class="flex gap-24">
						<span class="text-dark-grey tabular-nums">002</span>
						<a
							href={status.githubUrl}
							target="_blank"
							rel="noreferrer"
							class="text-ghost-grey underline decoration-dashed decoration-from-font underline-offset-4 transition-colors hover:text-white"
							>github.com/{status.github}</a
						>
					</li>
					<li class="flex gap-24">
						<span class="text-dark-grey tabular-nums">003</span>
						<a
							href={status.linkedinUrl}
							target="_blank"
							rel="noreferrer"
							class="text-ghost-grey underline decoration-dashed decoration-from-font underline-offset-4 transition-colors hover:text-white"
							>linkedin.com/in/{status.linkedin}</a
						>
					</li>
				</ul>
			</div>
		</div>

		<div
			class="flex flex-col rounded-8 bg-black p-16 text-white lg:col-span-12 lg:row-start-3 lg:p-32"
		>
			<p class="max-w-[70ch] font-mono text-ui text-mid-grey">{status.note}</p>
		</div>
	</div>
</section>
