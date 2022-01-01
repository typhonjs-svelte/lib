import { SvelteComponent, init, safe_not_equal, create_slot, element, insert, action_destroyer, update_slot_base, get_all_dirty_from_scope, get_slot_changes, is_function, transition_in, transition_out, detach } from 'svelte/internal';
import { applyStyles } from '@typhonjs-svelte/lib/action';

/* src\component\core\TJSStyleProperties.svelte generated by Svelte v3.44.0 */

function create_fragment(ctx) {
	let div;
	let applyStyles_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[2].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

	return {
		c() {
			div = element("div");
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			insert(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			current = true;

			if (!mounted) {
				dispose = action_destroyer(applyStyles_action = applyStyles.call(null, div, /*styles*/ ctx[0]));
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[1],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
						null
					);
				}
			}

			if (applyStyles_action && is_function(applyStyles_action.update) && dirty & /*styles*/ 1) applyStyles_action.update.call(null, /*styles*/ ctx[0]);
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { styles } = $$props;

	$$self.$$set = $$props => {
		if ('styles' in $$props) $$invalidate(0, styles = $$props.styles);
		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	};

	return [styles, $$scope, slots];
}

class TJSStyleProperties extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { styles: 0 });
	}
}

export { TJSStyleProperties };
//# sourceMappingURL=index.js.map
