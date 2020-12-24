 /**
 * Spotlight v2.1.0
 */

(function() {
	'use strict';

	const spotlight = function() {
		const input = document.getElementById('js-spotlight-input');
		const close = document.getElementById('js-spotlight-close');
		const supportingContent = 'js-spotlight-supporting-content';

		/////////////////////////////////////////////////////////////
		// detecting CSS aimation and transition end
		/////////////////////////////////////////////////////////////
		const onCSSAnimationOrTransitionEnd = function(
			type,
			target,
			task,
			args
		) {
			// only run once
			const runOnce = function(e) {
				// remove the event listener
				e.target.removeEventListener(e.type, runOnce);

				// run the task
				return task.apply(null, args);
			};

			// animationend with prefixes
			const animationend = [
				'webkitAnimationEnd',
				'mozAnimationEnd',
				'oAnimationEnd',
				'oanimationend',
				'animationend'
			];

			// transitionend with prefixes
			const transitionend = [
				'webkitTransitionEnd',
				'mozTransitionEnd',
				'oTransitionEnd',
				'transitionend'
			];

			// check to see if animationend or transitionend chosen
			const result =
				(type === 'onCSSAnimationEnd' && animationend) ||
				(type === 'onCSSTransitionEnd' && transitionend);

			// loop through array
			result.map(function(value) {
				// and listen for animation or transtion to end
				target.addEventListener(value, runOnce);
			});
		};

		/////////////////////////////////////////////////////////////
		// see if element is in viewport
		/////////////////////////////////////////////////////////////
		const isInViewport = function() {
			// get size of element and its position relative to the viewport
			const bounding = document
				.getElementById(supportingContent)
				.getBoundingClientRect();

			// return true if the entire element is in the viewport
			return (
				bounding.top >= 0 &&
				bounding.bottom <=
					(window.innerHeight ||
						document.documentElement.clientHeight)
			);
		};

		/////////////////////////////////////////////////////////////
		// helper function that returns vertical scroll
		/////////////////////////////////////////////////////////////
		const getScrollTop = function() {
			// return the element that is the root element of document
			const doc = document.documentElement;

			// return scroll position
			return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
		};

		/////////////////////////////////////////////////////////////
		// sets focus on the specified element
		/////////////////////////////////////////////////////////////
		const focusOnElement = function() {
			// clean up if available
			document.body.style.transform = '';
			document.body.classList.remove('spotlight-flip-translate');

			return input.focus();
		};

		/////////////////////////////////////////////////////////////
		// return user to spotlight when bottom close button clicked
		/////////////////////////////////////////////////////////////
		const returnToSpotlightOnClose = function(e) {
			// if spotlight is clicked, do nothing
			// if main content area is shorter than veritcal viewport, do nothing
			if (e.currentTarget.id === 'js-spotlight-input' || isInViewport())
				return;

			// store current scroll
			const prevScroll = getScrollTop();

			// location to scroll to
			const scrollToLocation =
			
				-100 + window.pageYOffset -
				90;

			// compute scroll offset
			const scrollOffset = scrollToLocation - prevScroll;

			// apply FLIP transform
			document.body.style.transform = `translate3d(0, ${scrollOffset}px, 0)`;

			// apply class that transitions transform back to zero
			document.body.classList.add('spotlight-flip-translate');

			// perform the scroll
			window.scroll(1000, scrollToLocation);

			// when animation has completed
			onCSSAnimationOrTransitionEnd(
				// watch for
				'onCSSAnimationEnd',
				// add event listener to this item
				document.body,
				// and set focus to label
				focusOnElement
			);

			return;
		};

		/////////////////////////////////////////////////////////////
		// set to false by default
		// if checked, update to true
		/////////////////////////////////////////////////////////////
		input.checked === true
			? input.setAttribute('aria-expanded', true)
			: input.setAttribute('aria-expanded', false);

		/////////////////////////////////////////////////////////////
		// set height to prevent page jumping
		/////////////////////////////////////////////////////////////
		input.style.height = input.offsetHeight / 16 + 'em';

		/////////////////////////////////////////////////////////////
		// keep focus on spotlight after clicked
		/////////////////////////////////////////////////////////////
		input.style.display = 'block';

		/////////////////////////////////////////////////////////////
		// show button if JS available
		/////////////////////////////////////////////////////////////
		close && close.classList.remove('is-hidden');

		/////////////////////////////////////////////////////////////
		// adjust height if needed
		/////////////////////////////////////////////////////////////
		const adjustHeight = function(status, sectionContent, actualHeight) {
			// get height of content
			const currentHeight = Math.round(
				sectionContent.offsetHeight + 1
			); /* add an additional pixel for Firefox */

			// if current height is less than actual height
			return currentHeight < actualHeight && status
				? (sectionContent.style.maxHeight = actualHeight + 'px') // increase height
				: (sectionContent.style.maxHeight = ''); // clean up inline styles
		};

		/////////////////////////////////////////////////////////////
		// fallback when overflow hidden is hiding content
		/////////////////////////////////////////////////////////////
		const checkHeight = function(status) {
			// content area
			const sectionContent = document.getElementById(supportingContent);

			// get height of hidden content
			const actualHeight = sectionContent.scrollHeight;

			// wait until transition ends
			// when animation has completed
			return onCSSAnimationOrTransitionEnd(
				// watch for
				'onCSSTransitionEnd',
				// add event listener to this item
				sectionContent,
				// and set focus to label
				adjustHeight,
				// arguments
				[status, sectionContent, actualHeight]
			);
		};

		/////////////////////////////////////////////////////////////
		// for those with disabilities
		/////////////////////////////////////////////////////////////
		const ariaExpanded = function(e) {
			// check status of aria-expanded
			const status = input.getAttribute('aria-expanded');

			// toggle aria-expanded
			/* eslint-disable */
			status === 'true'
				? (input.setAttribute('aria-expanded', false),
				  returnToSpotlightOnClose(e),
				  checkHeight(false))
				: (input.setAttribute('aria-expanded', true),
				  checkHeight(true));
			/* eslint-enable */

			// if bottom close button clicked
			return (
				e.target.id === 'js-spotlight-close' && (input.checked = false)
			);
		};

		// bottom close button
		close && close.addEventListener('click', ariaExpanded, false);

		// when checked
		input.addEventListener('click', ariaExpanded, false);
	};

	/////////////////////////////////////////////////////////////
	// document ready
	/////////////////////////////////////////////////////////////
	function ready(fn) {
		if (
			document.attachEvent
				? document.readyState === 'complete'
				: document.readyState !== 'loading'
		) {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	/////////////////////////////////////////////////////////////
	// kickstart
	/////////////////////////////////////////////////////////////
	ready(spotlight);
})(); /* IIFE end */
 
