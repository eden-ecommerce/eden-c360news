import {
  PortableText as BasePortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";

const defaultComponents: PortableTextComponents = {};

/** Thin wrapper around `@portabletext/react` for Sanity rich text blocks. */
export function PortableText({
  components,
  ...props
}: PortableTextProps) {
  return (
    <BasePortableText
      components={{ ...defaultComponents, ...components }}
      {...props}
    />
  );
}
