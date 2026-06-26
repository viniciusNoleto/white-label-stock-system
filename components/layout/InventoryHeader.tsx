'use client';

import { HoverCard, ActionIcon } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY } from '@/src/libs/i18n';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/src/shared/constants/locale';
import { FormButton } from '../form/Button';
import { useMemo } from 'react';

const LOCALE_FLAGS: Record<SupportedLocale, string> = {
  'pt-br': 'twemoji:flag-for-flag-brazil',
  'es-mx': 'twemoji:flag-for-flag-mexico',
  'en-us': 'twemoji:flag-for-flag-united-states',
};

const COLOR_SCHEME_OPTIONS = [
  { value: 'light' as const, icon: 'lucide:sun', labelKey: 'header.colorScheme.light' },
  { value: 'dark' as const, icon: 'lucide:moon', labelKey: 'header.colorScheme.dark' },
  { value: 'auto' as const, icon: 'lucide:monitor', labelKey: 'header.colorScheme.auto' },
];

function LanguageSwitcherPopover() {
  const { t, i18n } = useTranslation();

  function handleChange(locale: SupportedLocale) {
    i18n.changeLanguage(locale);
    if (typeof window !== 'undefined') localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  }

  const currentLocale = i18n.language as SupportedLocale;
  const currentFlag = LOCALE_FLAGS[currentLocale] ?? 'circle-flags:br';

  return (
    <HoverCard
      width={200}
      position="bottom-end"
      shadow="md"
      openDelay={100}
      closeDelay={200}
    >
      <HoverCard.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="xl"
          aria-label={t('language.label')}
        >
          <Icon
            icon={currentFlag}
            className="w-7 h-7"
          />
        </ActionIcon>
      </HoverCard.Target>

      <HoverCard.Dropdown className="p-1.5">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 py-1 mb-1">
          {t('language.label')}
        </p>

        <div className="flex flex-col gap-0.5">
          {SUPPORTED_LOCALES.map((locale) => (
            <FormButton
              key={locale}
              variant="subtle"
              color="gray"
              size="xs"
              fullWidth
              justify="start"
              leftIcon={LOCALE_FLAGS[locale]}
              onClick={() => handleChange(locale)}
              fw={locale === currentLocale ? 600 : 400}
            >
              {t(`language.${locale}`)}
            </FormButton>
          ))}
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

function ColorSchemeSwitcherPopover() {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const currentIcon = useMemo(() => {
    return ({
      light: 'lucide:sun',
      dark: 'lucide:moon',
      auto: 'lucide:monitor'
    })[colorScheme] ?? 'lucide:monitor'
  }, [colorScheme])

  return (
    <HoverCard
      width={180}
      position="bottom-end"
      shadow="md"
      openDelay={100}
      closeDelay={200}
    >
      <HoverCard.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="xl"
          aria-label={t('header.colorScheme.label')}
        >
          <Icon
            icon={currentIcon}
            className="w-5 h-5"
          />
        </ActionIcon>
      </HoverCard.Target>

      <HoverCard.Dropdown className="p-1.5">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 px-2 py-1 mb-1">
          {t('header.colorScheme.label')}
        </p>

        <div className="flex flex-col gap-0.5">
          {COLOR_SCHEME_OPTIONS.map((option) => (
            <FormButton
              key={option.value}
              variant="subtle"
              color="gray"
              size="xs"
              fullWidth
              justify="start"
              leftIcon={option.icon}
              onClick={() => setColorScheme(option.value)}
              fw={colorScheme === option.value ? 600 : 400}
            >
              {t(option.labelKey)}
            </FormButton>
          ))}
        </div>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export function InventoryHeader() {
  return (
    <header className="h-14 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-end px-4 gap-1 shrink-0">
      <ColorSchemeSwitcherPopover />

      <LanguageSwitcherPopover />
    </header>
  );
}
