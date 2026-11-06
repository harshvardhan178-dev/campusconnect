import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Default dark interface' },
    { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean white interface' },
    { id: 'system', label: 'System Mode', icon: Monitor, desc: 'Follows OS preference' },
  ];

  const currentOption = options.find((opt) => opt.id === theme) || options[0];
  const CurrentIcon = currentOption.icon;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-switcher-btn"
        aria-label="Select color theme"
        title={`Theme: ${currentOption.label}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <CurrentIcon size={18} style={{ color: 'var(--accent-primary)' }} />
      </button>

      {isOpen && (
        <div
          className="theme-dropdown-menu"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: '210px',
            backgroundColor: 'var(--dropdown-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.5rem',
            zIndex: 1000,
            animation: 'fadeInSlide 0.15s ease-out',
          }}
        >
          <div
            style={{
              padding: '0.4rem 0.6rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '0.35rem',
            }}
          >
            Appearance
          </div>

          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.id;

            return (
              <button
                key={option.id}
                onClick={() => {
                  setTheme(option.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--accent-glow)' : 'transparent',
                  border: 'none',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? '600' : '500',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={16} />
                  <span>{option.label}</span>
                </div>
                {isSelected && <Check size={15} style={{ color: 'var(--accent-primary)' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
