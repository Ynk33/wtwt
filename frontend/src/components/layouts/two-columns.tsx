import React from 'react';

type ResponsiveRatio = {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
};

// Mapping ratios to Tailwind classes to ensure generation
const ratioClassMap: Record<number, string> = {
  1: 'flex-[1]',
  2: 'flex-[2]',
  3: 'flex-[3]',
  4: 'flex-[4]',
  5: 'flex-[5]',
  6: 'flex-[6]',
};

const getRatioClass = (ratio: number, prefix = ''): string => {
  const baseClass = ratioClassMap[ratio] || `flex-[${ratio}]`;
  return prefix ? `${prefix}:${baseClass}` : baseClass;
};

const TwoColumns = ({
  left,
  right,
  leftRatio = 1,
  rightRatio = 1,
  gap = 'gap-4',
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  leftRatio?: number | ResponsiveRatio;
  rightRatio?: number | ResponsiveRatio;
  gap?: string;
}): React.ReactNode => {
  const generateFlexClass = (ratio: number | ResponsiveRatio): string => {
    if (typeof ratio === 'number') {
      return getRatioClass(ratio);
    }

    const classes: string[] = [];
    const defaultRatio =
      ratio.sm || ratio.md || ratio.lg || ratio.xl || ratio['2xl'] || 1;

    classes.push(getRatioClass(defaultRatio));

    if (ratio.sm !== undefined) classes.push(getRatioClass(ratio.sm, 'sm'));
    if (ratio.md !== undefined) classes.push(getRatioClass(ratio.md, 'md'));
    if (ratio.lg !== undefined) classes.push(getRatioClass(ratio.lg, 'lg'));
    if (ratio.xl !== undefined) classes.push(getRatioClass(ratio.xl, 'xl'));
    if (ratio['2xl'] !== undefined)
      classes.push(getRatioClass(ratio['2xl'], '2xl'));

    return classes.join(' ');
  };

  const leftClass = generateFlexClass(leftRatio);
  const rightClass = generateFlexClass(rightRatio);

  return (
    <div className={`flex flex-col sm:flex-row h-full ${gap}`}>
      <div className={`${leftClass} h-full`}>{left}</div>
      <div className={`${rightClass} h-full`}>{right}</div>
    </div>
  );
};

export default TwoColumns;
