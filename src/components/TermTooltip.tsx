import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TermTooltipProps {
  term: string;
  definition: string;
}

const TermTooltip = ({ term, definition }: TermTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const calculatePosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceAbove = buttonRect.top;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    
    // If there's more space below or not enough space above (less than 120px for tooltip)
    if (spaceBelow > spaceAbove || spaceAbove < 120) {
      setPosition('bottom');
    } else {
      setPosition('top');
    }
  };

  const toggleTooltip = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  const getTooltipStyles = () => {
    if (!buttonRef.current) return {};

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const tooltipWidth = 250; // max-width
    
    let left = buttonRect.left + (buttonRect.width / 2) - (tooltipWidth / 2);
    
    // Ensure tooltip doesn't go off screen horizontally
    const padding = 16;
    if (left < padding) {
      left = padding;
    } else if (left + tooltipWidth > window.innerWidth - padding) {
      left = window.innerWidth - tooltipWidth - padding;
    }

    if (position === 'top') {
      return {
        position: 'fixed' as const,
        top: buttonRect.top - 8,
        left: left,
        transform: 'translateY(-100%)',
        zIndex: 9999,
      };
    } else {
      return {
        position: 'fixed' as const,
        top: buttonRect.bottom + 8,
        left: left,
        zIndex: 9999,
      };
    }
  };

  return (
    <>
      <span className="relative inline-block">
        <button
          ref={buttonRef}
          onClick={toggleTooltip}
          className="inline-flex items-center mx-1 p-0.5 rounded-full hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          type="button"
          aria-label={`Penjelasan untuk ${term}`}
        >
          <Info className="h-3.5 w-3.5 text-primary/70 hover:text-primary transition-colors" />
        </button>
      </span>
      
      {isOpen && (
        <div
          ref={tooltipRef}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            ...getTooltipStyles(),
            maxWidth: '250px',
            width: 'max-content',
            minWidth: '200px',
          }}
        >
          <div className="p-3">
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 break-words">
              {term}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed break-words overflow-wrap-anywhere">
              {definition}
            </p>
          </div>
          
          {/* Arrow */}
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${
              position === 'top' 
                ? 'top-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700' 
                : 'bottom-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-200 dark:border-b-gray-700'
            }`}
          />
          <div 
            className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${
              position === 'top' 
                ? 'top-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800'
                : 'bottom-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white dark:border-b-gray-800'
            }`}
            style={{ 
              marginTop: position === 'top' ? '-4px' : undefined,
              marginBottom: position === 'bottom' ? '-4px' : undefined 
            }}
          />
        </div>
      )}
    </>
  );
};

export default TermTooltip;