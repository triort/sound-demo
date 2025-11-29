interface RubyProps {
  children: string;
  rt: string;
}

export default function Ruby({ children, rt }: RubyProps) {
  return (
    <ruby>
      {children}
      <rt>{rt}</rt>
    </ruby>
  );
}
