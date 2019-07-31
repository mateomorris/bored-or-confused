import { S as SvelteComponentDev, i as init, s as safe_not_equal, e as element, o as text, u as space, a as claim_element, b as children, p as claim_text, d as detach, f as attr, g as add_location, h as insert, q as append, n as noop } from './chunk.66308fb8.js';
import './chunk.d453e17d.js';

/* src/routes/index.svelte generated by Svelte v3.6.10 */

const file = "src/routes/index.svelte";

function create_fragment(ctx) {
	var h1, t0, t1, h2, t2, t3, div2, div0, a0, t4, t5, div1, a1, t6;

	return {
		c: function create() {
			h1 = element("h1");
			t0 = text("Bored or Confused");
			t1 = space();
			h2 = element("h2");
			t2 = text("A tool for discreetly giving feedback to an instructor while they're lecturing. Great for introverts.");
			t3 = space();
			div2 = element("div");
			div0 = element("div");
			a0 = element("a");
			t4 = text("Student");
			t5 = space();
			div1 = element("div");
			a1 = element("a");
			t6 = text("Instructor");
			this.h();
		},

		l: function claim(nodes) {
			h1 = claim_element(nodes, "H1", { class: true }, false);
			var h1_nodes = children(h1);

			t0 = claim_text(h1_nodes, "Bored or Confused");
			h1_nodes.forEach(detach);
			t1 = claim_text(nodes, "\n");

			h2 = claim_element(nodes, "H2", { class: true }, false);
			var h2_nodes = children(h2);

			t2 = claim_text(h2_nodes, "A tool for discreetly giving feedback to an instructor while they're lecturing. Great for introverts.");
			h2_nodes.forEach(detach);
			t3 = claim_text(nodes, "\n");

			div2 = claim_element(nodes, "DIV", { class: true }, false);
			var div2_nodes = children(div2);

			div0 = claim_element(div2_nodes, "DIV", { class: true }, false);
			var div0_nodes = children(div0);

			a0 = claim_element(div0_nodes, "A", { class: true, href: true }, false);
			var a0_nodes = children(a0);

			t4 = claim_text(a0_nodes, "Student");
			a0_nodes.forEach(detach);
			div0_nodes.forEach(detach);
			t5 = claim_text(div2_nodes, "\n  ");

			div1 = claim_element(div2_nodes, "DIV", { class: true }, false);
			var div1_nodes = children(div1);

			a1 = claim_element(div1_nodes, "A", { class: true, href: true }, false);
			var a1_nodes = children(a1);

			t6 = claim_text(a1_nodes, "Instructor");
			a1_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			div2_nodes.forEach(detach);
			this.h();
		},

		h: function hydrate() {
			attr(h1, "class", "title");
			add_location(h1, file, 21, 0, 512);
			attr(h2, "class", "subtitle");
			add_location(h2, file, 22, 0, 553);
			attr(a0, "class", "button is-large is-fullwidth is-info svelte-1n6ce34");
			attr(a0, "href", "/student");
			add_location(a0, file, 27, 4, 734);
			attr(div0, "class", "column");
			add_location(div0, file, 26, 2, 709);
			attr(a1, "class", "button is-large is-fullwidth is-success svelte-1n6ce34");
			attr(a1, "href", "/instructor");
			add_location(a1, file, 30, 4, 846);
			attr(div1, "class", "column");
			add_location(div1, file, 29, 2, 821);
			attr(div2, "class", "columns");
			add_location(div2, file, 25, 0, 685);
		},

		m: function mount(target, anchor) {
			insert(target, h1, anchor);
			append(h1, t0);
			insert(target, t1, anchor);
			insert(target, h2, anchor);
			append(h2, t2);
			insert(target, t3, anchor);
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, a0);
			append(a0, t4);
			append(div2, t5);
			append(div2, div1);
			append(div1, a1);
			append(a1, t6);
		},

		p: noop,
		i: noop,
		o: noop,

		d: function destroy(detaching) {
			if (detaching) {
				detach(h1);
				detach(t1);
				detach(h2);
				detach(t3);
				detach(div2);
			}
		}
	};
}

class Index extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, null, create_fragment, safe_not_equal, []);
	}
}

export default Index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYjJhYmQzZTguanMiLCJzb3VyY2VzIjpbXSwic291cmNlc0NvbnRlbnQiOltdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
