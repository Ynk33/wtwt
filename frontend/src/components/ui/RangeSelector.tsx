import React, { useCallback, useEffect, useRef, useState } from 'react';

import Label from '@components/ui/Label';
import { cn } from '@utils/cn';

interface RangeSelectorProps {
  label?: string;
  min: number; // Absolute minimum bound of the range
  max: number; // Absolute maximum bound of the range
  value?: { min?: number; max?: number }; // Current values (optional)
  onChange: (value: { min?: number; max?: number }) => void;
  step?: number; // Increment step (default: 1)
  disabled?: boolean;
  className?: string;
  unit?: string; // Displayed unit (e.g., "years", "⭐")
  placeholderMin?: string; // Placeholder for min input
  placeholderMax?: string; // Placeholder for max input
}

/**
 * RangeSelector component for selecting numeric ranges with optional min/max bounds
 * Supports slider with 0, 1, or 2 handles depending on which bounds are set
 */
const RangeSelector = React.forwardRef<HTMLDivElement, RangeSelectorProps>(
  (
    {
      label,
      min: minAbs,
      max: maxAbs,
      value,
      onChange,
      step = 1,
      disabled = false,
      className,
      unit,
      placeholderMin = 'Min',
      placeholderMax = 'Max',
      ...props
    },
    ref
  ) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const [localMin, setLocalMin] = useState<number | undefined>(value?.min);
    const [localMax, setLocalMax] = useState<number | undefined>(value?.max);
    // Local input values for typing (not validated until blur/enter)
    const [inputMinValue, setInputMinValue] = useState<string>(
      value?.min !== undefined ? value.min.toString() : ''
    );
    const [inputMaxValue, setInputMaxValue] = useState<string>(
      value?.max !== undefined ? value.max.toString() : ''
    );

    // Calculate number of decimal places needed based on step
    const getDecimalPlaces = useCallback((stepValue: number): number => {
      if (stepValue % 1 === 0) return 0;
      const stepStr = stepValue.toString();
      if (stepStr.includes('e')) {
        // Handle scientific notation
        const parts = stepStr.split('e');
        const baseDecimals = parts[0].includes('.')
          ? parts[0].split('.')[1].length
          : 0;
        const exponent = parseInt(parts[1], 10);
        return Math.max(0, baseDecimals - exponent);
      }
      return stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
    }, []);

    // Format value according to step to avoid floating point precision issues
    const formatValue = useCallback(
      (val: number): string => {
        const decimalPlaces = getDecimalPlaces(step);
        // Round to avoid floating point errors, then format
        // Use parseFloat to remove trailing zeros after toFixed
        const rounded = Math.round(val / step) * step;
        const formatted = rounded.toFixed(decimalPlaces);
        // Remove trailing zeros and decimal point if not needed
        return parseFloat(formatted).toString();
      },
      [step, getDecimalPlaces]
    );

    // Sync local state with prop value
    useEffect(() => {
      setLocalMin(value?.min);
      setLocalMax(value?.max);
      // Only update input values if they don't match (to avoid interfering with typing)
      if (value?.min !== undefined) {
        const formatted = formatValue(value.min);
        setInputMinValue((prev) => {
          // Only update if the formatted value is different and user isn't actively typing
          // This prevents interference during typing
          return prev === formatted ? prev : formatted;
        });
      } else {
        setInputMinValue('');
      }
      if (value?.max !== undefined) {
        const formatted = formatValue(value.max);
        setInputMaxValue((prev) => {
          return prev === formatted ? prev : formatted;
        });
      } else {
        setInputMaxValue('');
      }
    }, [value?.min, value?.max, formatValue]);

    // Clamp value to absolute bounds and snap to step
    const clampAndSnap = useCallback(
      (val: number): number => {
        const clamped = Math.max(minAbs, Math.min(maxAbs, val));
        return Math.round(clamped / step) * step;
      },
      [minAbs, maxAbs, step]
    );

    // Convert value to percentage position
    const valueToPercent = useCallback(
      (val: number): number => {
        if (maxAbs === minAbs) return 0;
        return ((val - minAbs) / (maxAbs - minAbs)) * 100;
      },
      [minAbs, maxAbs]
    );

    // Convert percentage to value
    const percentToValue = useCallback(
      (percent: number): number => {
        const val = minAbs + (percent / 100) * (maxAbs - minAbs);
        return clampAndSnap(val);
      },
      [minAbs, maxAbs, clampAndSnap]
    );

    // Update values and notify parent
    const updateValues = useCallback(
      (newMin: number | undefined, newMax: number | undefined) => {
        // Validation: ensure min <= max if both are defined
        let finalMin = newMin;
        let finalMax = newMax;

        if (finalMin !== undefined && finalMax !== undefined) {
          if (finalMin > finalMax) {
            // Swap if min > max
            [finalMin, finalMax] = [finalMax, finalMin];
          }
        }

        setLocalMin(finalMin);
        setLocalMax(finalMax);
        // Update input values to reflect the new values (for slider interactions)
        setInputMinValue(finalMin !== undefined ? formatValue(finalMin) : '');
        setInputMaxValue(finalMax !== undefined ? formatValue(finalMax) : '');
        onChange({ min: finalMin, max: finalMax });
      },
      [onChange, formatValue]
    );

    // Handle slider click/drag
    const handleSliderInteraction = useCallback(
      (clientX: number, draggingHandle?: 'min' | 'max') => {
        if (!sliderRef.current || disabled) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(
          0,
          Math.min(100, ((clientX - rect.left) / rect.width) * 100)
        );
        const newValue = percentToValue(percent);

        // If we're dragging a specific handle, move that one directly
        if (draggingHandle === 'min') {
          if (localMax !== undefined && newValue > localMax) {
            // If dragging min past max, swap them
            updateValues(localMax, newValue);
          } else {
            updateValues(newValue, localMax);
          }
          return;
        }

        if (draggingHandle === 'max') {
          if (localMin !== undefined && newValue < localMin) {
            // If dragging max past min, swap them
            updateValues(newValue, localMin);
          } else {
            updateValues(localMin, newValue);
          }
          return;
        }

        // Otherwise, determine which handle to move based on proximity (click case)
        if (localMin === undefined && localMax === undefined) {
          // No bounds set, set both to the clicked value
          updateValues(newValue, newValue);
        } else if (localMin !== undefined && localMax === undefined) {
          // Only min is set
          if (newValue >= localMin) {
            updateValues(localMin, newValue);
          } else {
            updateValues(newValue, undefined);
          }
        } else if (localMin === undefined && localMax !== undefined) {
          // Only max is set
          if (newValue <= localMax) {
            updateValues(newValue, localMax);
          } else {
            updateValues(undefined, newValue);
          }
        } else if (localMin !== undefined && localMax !== undefined) {
          // Both are set, determine which handle to move
          const minPercent = valueToPercent(localMin);
          const maxPercent = valueToPercent(localMax);
          const distanceToMin = Math.abs(percent - minPercent);
          const distanceToMax = Math.abs(percent - maxPercent);

          if (distanceToMin < distanceToMax) {
            // Move min handle
            if (newValue <= localMax) {
              updateValues(newValue, localMax);
            } else {
              // Swap to max
              updateValues(localMax, newValue);
            }
          } else {
            // Move max handle
            if (newValue >= localMin) {
              updateValues(localMin, newValue);
            } else {
              // Swap to min
              updateValues(newValue, localMin);
            }
          }
        }
      },
      [
        localMin,
        localMax,
        disabled,
        percentToValue,
        valueToPercent,
        updateValues,
      ]
    );

    // Mouse/touch event handlers
    const handleMouseDown = useCallback(
      (e: React.MouseEvent, handle: 'min' | 'max') => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(handle);

        const handleMove = (moveEvent: MouseEvent) => {
          // Pass the specific handle being dragged to avoid recalculating
          handleSliderInteraction(moveEvent.clientX, handle);
        };

        const handleUp = () => {
          setIsDragging(null);
          document.removeEventListener('mousemove', handleMove);
          document.removeEventListener('mouseup', handleUp);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
      },
      [disabled, handleSliderInteraction]
    );

    const handleSliderClick = useCallback(
      (e: React.MouseEvent) => {
        if (disabled || isDragging) return;
        handleSliderInteraction(e.clientX);
      },
      [disabled, isDragging, handleSliderInteraction]
    );

    // Validate and commit min input value
    const commitMinValue = useCallback(
      (inputValue: string) => {
        if (inputValue === '' || inputValue.trim() === '') {
          updateValues(undefined, localMax);
          setInputMinValue('');
          return;
        }

        const numValue = parseFloat(inputValue);
        if (!isNaN(numValue)) {
          const clamped = clampAndSnap(numValue);
          updateValues(clamped, localMax);
          setInputMinValue(formatValue(clamped));
        } else {
          // Invalid input, revert to current value
          setInputMinValue(localMin !== undefined ? formatValue(localMin) : '');
        }
      },
      [localMax, localMin, clampAndSnap, updateValues, formatValue]
    );

    // Validate and commit max input value
    const commitMaxValue = useCallback(
      (inputValue: string) => {
        if (inputValue === '' || inputValue.trim() === '') {
          updateValues(localMin, undefined);
          setInputMaxValue('');
          return;
        }

        const numValue = parseFloat(inputValue);
        if (!isNaN(numValue)) {
          const clamped = clampAndSnap(numValue);
          updateValues(localMin, clamped);
          setInputMaxValue(formatValue(clamped));
        } else {
          // Invalid input, revert to current value
          setInputMaxValue(localMax !== undefined ? formatValue(localMax) : '');
        }
      },
      [localMin, localMax, clampAndSnap, updateValues, formatValue]
    );

    // Handle input changes (only update local input state, don't validate yet)
    const handleMinInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMinValue(e.target.value);
      },
      []
    );

    const handleMaxInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMaxValue(e.target.value);
      },
      []
    );

    // Handle input blur (validate and commit)
    const handleMinInputBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        commitMinValue(e.target.value);
      },
      [commitMinValue]
    );

    const handleMaxInputBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        commitMaxValue(e.target.value);
      },
      [commitMaxValue]
    );

    // Handle Enter key (validate and commit)
    const handleMinInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitMinValue(e.currentTarget.value);
          e.currentTarget.blur();
        }
      },
      [commitMinValue]
    );

    const handleMaxInputKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitMaxValue(e.currentTarget.value);
          e.currentTarget.blur();
        }
      },
      [commitMaxValue]
    );

    // Clear handlers
    const clearMin = useCallback(() => {
      updateValues(undefined, localMax);
    }, [localMax, updateValues]);

    const clearMax = useCallback(() => {
      updateValues(localMin, undefined);
    }, [localMin, updateValues]);

    // Keyboard navigation for handles
    const handleMinKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || localMin === undefined) return;

        let newValue = localMin;
        const arrowStep = step * (e.shiftKey ? 10 : 1);

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            newValue = clampAndSnap(localMin + arrowStep);
            if (localMax === undefined || newValue <= localMax) {
              updateValues(newValue, localMax);
            }
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            newValue = clampAndSnap(localMin - arrowStep);
            if (newValue >= minAbs) {
              updateValues(newValue, localMax);
            } else {
              updateValues(undefined, localMax);
            }
            break;
          case 'Home':
            e.preventDefault();
            updateValues(minAbs, localMax);
            break;
          case 'End':
            e.preventDefault();
            if (localMax !== undefined) {
              updateValues(localMax, localMax);
            } else {
              updateValues(maxAbs, undefined);
            }
            break;
        }
      },
      [
        disabled,
        localMin,
        localMax,
        step,
        clampAndSnap,
        minAbs,
        maxAbs,
        updateValues,
      ]
    );

    const handleMaxKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || localMax === undefined) return;

        let newValue = localMax;
        const arrowStep = step * (e.shiftKey ? 10 : 1);

        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
            e.preventDefault();
            newValue = clampAndSnap(localMax + arrowStep);
            if (newValue <= maxAbs) {
              updateValues(localMin, newValue);
            } else {
              updateValues(localMin, undefined);
            }
            break;
          case 'ArrowLeft':
          case 'ArrowDown':
            e.preventDefault();
            newValue = clampAndSnap(localMax - arrowStep);
            if (localMin === undefined || newValue >= localMin) {
              updateValues(localMin, newValue);
            }
            break;
          case 'Home':
            e.preventDefault();
            if (localMin !== undefined) {
              updateValues(localMin, localMin);
            } else {
              updateValues(minAbs, undefined);
            }
            break;
          case 'End':
            e.preventDefault();
            updateValues(localMin, maxAbs);
            break;
        }
      },
      [
        disabled,
        localMin,
        localMax,
        step,
        clampAndSnap,
        minAbs,
        maxAbs,
        updateValues,
      ]
    );

    // Calculate slider positions and track styles
    const minPercent = localMin !== undefined ? valueToPercent(localMin) : 0;
    const maxPercent = localMax !== undefined ? valueToPercent(localMax) : 100;

    const hasMin = localMin !== undefined;
    const hasMax = localMax !== undefined;
    const hasBoth = hasMin && hasMax;

    // Track active range styling
    let trackLeft = 0;
    let trackWidth = 0;

    if (hasBoth) {
      trackLeft = minPercent;
      trackWidth = maxPercent - minPercent;
    } else if (hasMin) {
      trackLeft = minPercent;
      trackWidth = 100 - minPercent;
    } else if (hasMax) {
      trackLeft = 0;
      trackWidth = maxPercent;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        {label && (
          <Label>
            {label}
            {unit && <span className="text-gray-500 ml-1">({unit})</span>}
          </Label>
        )}

        <div className="flex items-center gap-3">
          {/* Min Input */}
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={minAbs}
              max={maxAbs}
              step={step}
              value={inputMinValue}
              onChange={handleMinInputChange}
              onBlur={handleMinInputBlur}
              onKeyDown={handleMinInputKeyDown}
              disabled={disabled}
              placeholder={placeholderMin}
              className={cn(
                'w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'disabled:bg-gray-100 disabled:cursor-not-allowed',
                'transition-all'
              )}
              aria-label={`Minimum ${label || 'value'}`}
            />
            {hasMin && (
              <button
                type="button"
                onClick={clearMin}
                disabled={disabled}
                className={cn(
                  'w-6 h-6 flex items-center justify-center rounded',
                  'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'transition-colors',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
                aria-label="Clear minimum value"
              >
                ×
              </button>
            )}
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            className={cn(
              'flex-1 relative h-6 flex items-center cursor-pointer',
              disabled && 'cursor-not-allowed'
            )}
            onClick={handleSliderClick}
            role="slider"
            aria-label={`${label || 'Range'} selector`}
            aria-valuemin={minAbs}
            aria-valuemax={maxAbs}
            aria-valuenow={hasBoth ? localMin : (localMin ?? localMax)}
          >
            {/* Track background */}
            <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />

            {/* Active track */}
            {!disabled && (hasMin || hasMax) && (
              <div
                className="absolute h-1.5 bg-blue-500 rounded-full"
                style={{
                  left: `${trackLeft}%`,
                  width: `${trackWidth}%`,
                }}
              />
            )}

            {/* Min handle */}
            {hasMin && (
              <div
                className={cn(
                  'absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full',
                  'shadow-md transform -translate-x-1/2 cursor-grab',
                  'hover:scale-110 active:scale-95 transition-transform',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  disabled && 'cursor-not-allowed'
                )}
                style={{ left: `${minPercent}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'min');
                }}
                onKeyDown={handleMinKeyDown}
                role="slider"
                aria-label="Minimum value"
                aria-valuemin={minAbs}
                aria-valuemax={localMax ?? maxAbs}
                aria-valuenow={localMin}
                tabIndex={disabled ? -1 : 0}
              />
            )}

            {/* Max handle */}
            {hasMax && (
              <div
                className={cn(
                  'absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full',
                  'shadow-md transform -translate-x-1/2 cursor-grab',
                  'hover:scale-110 active:scale-95 transition-transform',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  disabled && 'cursor-not-allowed'
                )}
                style={{ left: `${maxPercent}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, 'max');
                }}
                onKeyDown={handleMaxKeyDown}
                role="slider"
                aria-label="Maximum value"
                aria-valuemin={localMin ?? minAbs}
                aria-valuemax={maxAbs}
                aria-valuenow={localMax}
                tabIndex={disabled ? -1 : 0}
              />
            )}
          </div>

          {/* Max Input */}
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={minAbs}
              max={maxAbs}
              step={step}
              value={inputMaxValue}
              onChange={handleMaxInputChange}
              onBlur={handleMaxInputBlur}
              onKeyDown={handleMaxInputKeyDown}
              disabled={disabled}
              placeholder={placeholderMax}
              className={cn(
                'w-20 px-2 py-1.5 text-sm border border-gray-300 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'disabled:bg-gray-100 disabled:cursor-not-allowed',
                'transition-all'
              )}
              aria-label={`Maximum ${label || 'value'}`}
            />
            {hasMax && (
              <button
                type="button"
                onClick={clearMax}
                disabled={disabled}
                className={cn(
                  'w-6 h-6 flex items-center justify-center rounded',
                  'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'transition-colors',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
                aria-label="Clear maximum value"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

RangeSelector.displayName = 'RangeSelector';

export default RangeSelector;
