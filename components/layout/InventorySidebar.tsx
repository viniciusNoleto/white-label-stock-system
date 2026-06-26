'use client';

import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/libs/utils';

const NAV_ITEMS = [
  { href: '/inventory/items', icon: 'lucide:package', labelKey: 'sidebar.items' },
  { href: '/inventory/categories', icon: 'lucide:tag', labelKey: 'sidebar.categories' },
  { href: '/inventory/units', icon: 'lucide:ruler', labelKey: 'sidebar.units' },
  { href: '/inventory/storages', icon: 'lucide:warehouse', labelKey: 'sidebar.storages' },
] as const;

export function InventorySidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-full border-r border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col shrink-0">
      <div className="h-14 px-4 border-b border-gray-100 dark:border-neutral-800 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm shadow-primary-200">
            <Icon
              icon="lucide:package"
              className="text-white w-4 h-4"
            />
          </div>

          <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">
            StockFlow
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 pb-1 pt-0.5">
          {t('sidebar.section')}
        </p>

        {NAV_ITEMS.map(({ href, icon, labelKey }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors no-underline',
                isActive
                  ? 'bg-primary-500/10 dark:bg-primary-400/10 text-primary-500 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              <Icon
                icon={icon}
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
                )}
              />

              <span>
                {t(labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
