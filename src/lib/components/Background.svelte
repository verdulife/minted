<div id="bg" class="pointer-events-none fixed inset-0 -z-10 opacity-10"></div>

<style>
	@keyframes bg {
		0% {
			--x-0: 85%;
			--s-start-0: 9%;
			--s-end-0: 55%;
			--y-0: 80%;
			--c-0: hsla(267, 52%, 83%, 1);
			--x-1: 60%;
			--c-1: hsla(336, 100%, 82%, 1);
			--y-1: 24%;
			--s-start-1: 5%;
			--s-end-1: 72%;
			--y-2: 82%;
			--s-start-2: 5%;
			--s-end-2: 52%;
			--c-2: hsla(54, 100%, 65%, 0.49);
			--x-2: 13%;
			--y-3: 7%;
			--c-3: hsla(299, 72%, 68%, 1);
			--s-start-3: 13%;
			--s-end-3: 68%;
			--x-3: 24%;
		}

		100% {
			--x-0: 31%;
			--s-start-0: 9%;
			--s-end-0: 55%;
			--y-0: 94%;
			--c-0: hsla(267, 52%, 83%, 1);
			--x-1: 2%;
			--c-1: hsla(337, 82%, 95%, 1);
			--y-1: 25%;
			--s-start-1: 5%;
			--s-end-1: 72%;
			--y-2: 20%;
			--s-start-2: 5%;
			--s-end-2: 52%;
			--c-2: hsla(54, 100%, 65%, 0.49);
			--x-2: 98%;
			--y-3: 92%;
			--c-3: hsla(299, 72%, 68%, 1);
			--s-start-3: 13%;
			--s-end-3: 68%;
			--x-3: 95%;
		}
	}

	@property --x-0 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 85%;
	}

	@property --s-start-0 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 9%;
	}

	@property --s-end-0 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 55%;
	}

	@property --y-0 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 80%;
	}

	@property --c-0 {
		syntax: '<color>';
		inherits: false;
		initial-value: hsla(267, 52%, 83%, 1);
	}

	@property --x-1 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 60%;
	}

	@property --c-1 {
		syntax: '<color>';
		inherits: false;
		initial-value: hsla(336, 100%, 82%, 1);
	}

	@property --y-1 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 24%;
	}

	@property --s-start-1 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 5%;
	}

	@property --s-end-1 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 72%;
	}

	@property --y-2 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 82%;
	}

	@property --s-start-2 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 5%;
	}

	@property --s-end-2 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 52%;
	}

	@property --c-2 {
		syntax: '<color>';
		inherits: false;
		initial-value: hsla(54, 100%, 65%, 0.49);
	}

	@property --x-2 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 13%;
	}

	@property --y-3 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 7%;
	}

	@property --c-3 {
		syntax: '<color>';
		inherits: false;
		initial-value: hsla(299, 72%, 68%, 1);
	}

	@property --s-start-3 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 13%;
	}

	@property --s-end-3 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 68%;
	}

	@property --x-3 {
		syntax: '<percentage>';
		inherits: false;
		initial-value: 24%;
	}

	#bg {
		--x-0: 85%;
		--y-0: 80%;
		--c-0: hsla(267, 52%, 83%, 1);
		--x-1: 60%;
		--c-1: hsla(336, 100%, 82%, 1);
		--y-1: 24%;
		--y-2: 82%;
		--c-2: hsla(54, 100%, 65%, 0.49);
		--x-2: 13%;
		--y-3: 7%;
		--c-3: hsla(299, 72%, 68%, 1);
		--x-3: 24%;
		background-image:
			radial-gradient(
				circle at var(--x-0) var(--y-0),
				var(--c-0) var(--s-start-0),
				transparent var(--s-end-0)
			),
			radial-gradient(
				circle at var(--x-1) var(--y-1),
				var(--c-1) var(--s-start-1),
				transparent var(--s-end-1)
			),
			radial-gradient(
				circle at var(--x-2) var(--y-2),
				var(--c-2) var(--s-start-2),
				transparent var(--s-end-2)
			),
			radial-gradient(
				circle at var(--x-3) var(--y-3),
				var(--c-3) var(--s-start-3),
				transparent var(--s-end-3)
			);
		animation: bg 10s linear infinite alternate;
		background-blend-mode: normal, normal, normal, normal;
		will-change: transform, opacity;
		contain: paint;
	}
</style>
