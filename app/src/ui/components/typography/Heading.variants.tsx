import { Heading, HeadingBaseProps } from "./Heading";

/**
 * ### H1
 * GDS H1 component
 */
export function H1(props: HeadingBaseProps) {
  return <Heading {...props} type="h1" />;
}

/**
 * ### H2
 * GDS H2 component
 */
export function H2(props: HeadingBaseProps) {
  return <Heading {...props} type="h2" />;
}

/**
 * ### H3
 * GDS H3 component
 */
export function H3(props: HeadingBaseProps) {
  return <Heading {...props} type="h3" />;
}

/**
 * ### H4
 * GDS H4 component
 */
export function H4(props: HeadingBaseProps) {
  return <Heading {...props} type="h4" />;
}
