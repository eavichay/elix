// Elix is a JavaScript project, but we use TypeScript as an internal tool to
// confirm our code is type safe.

/// <reference path="shared.d.ts"/>

declare const ShadowTemplateMixin: Mixin<{
  connectedCallback?(): void;
}, {
  $: {
    [key: string]: Element;
  },
  connectedCallback(): void;
  shadowRoot: ShadowRoot;
}>;

export default ShadowTemplateMixin;
