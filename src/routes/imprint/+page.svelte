<script lang="ts">
	import { profile } from '$lib/data/profile';
	import { email } from '$lib/email';
	import { resolve } from '$app/paths';
</script>

<div class="min-h-svh bg-[#181818] text-white">
	<div class="mx-auto w-full max-w-[800px] px-16 pt-140 pb-72 lg:py-160">
		<a
			href={resolve('/')}
			class="font-mono text-caption-10 text-white/50 uppercase transition-colors hover:text-white"
			>← Back</a
		>

		<h1 class="mt-40 mb-64 font-mono text-headline-10 font-medium uppercase">Imprint</h1>

		<div class="flex flex-col gap-48 font-mono text-caption-20 leading-relaxed text-ghost-grey">
			<section class="flex flex-col gap-16">
				<h2 class="text-ui text-white/50 uppercase">Angaben gemäß § 18 DDG</h2>
				<p>{profile.legalName} (alias "{profile.name}")</p>
				<p>Staudengarten 33</p>
				<p>44894 Bochum, Germany</p>
				<p>
					<a
						href="mailto:{email}"
						class="underline decoration-dashed decoration-from-font underline-offset-4 transition-colors hover:text-white"
						>{email}</a
					>
				</p>
			</section>

			<section class="flex flex-col gap-16">
				<h2 class="text-ui text-white/50 uppercase">Responsible for content</h2>
				<p class="max-w-[65ch] text-body-10">
					This site is a personal portfolio presenting the work of {profile.legalName} under the public
					alias "{profile.name}". Content is maintained solely by the person named above.
				</p>
			</section>

			<section class="flex flex-col gap-16">
				<h2 class="text-ui text-white/50 uppercase">Privacy</h2>
				<p class="max-w-[65ch] text-body-10">
					This site sets no cookies, runs no analytics, loads no third-party scripts or fonts, and
					collects no personal data. All fonts and assets are self-hosted. Contacting me by email is
					voluntary; the data you send is used only to answer your message.
				</p>
			</section>

			<section class="flex flex-col gap-16">
				<h2 class="text-ui text-white/50 uppercase">Copyright</h2>
				<p class="max-w-[65ch] text-body-10">
					All code and content are © 2026 {profile.name}.
				</p>
			</section>
		</div>
	</div>
</div>
