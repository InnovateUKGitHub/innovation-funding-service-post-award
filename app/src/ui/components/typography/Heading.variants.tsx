import { Heading, HeadingBaseProps } from "./Heading";

export function H1(props: HeadingBaseProps) {
  return <Heading {...props} type="h1" />;
}

export function H2(props: HeadingBaseProps) {
  return <Heading {...props} type="h2" />;
}

export function H3(props: HeadingBaseProps) {
  return <Heading {...props} type="h3" />;
}

export function H4(props: HeadingBaseProps) {
  return <Heading {...props} type="h4" />;
}
