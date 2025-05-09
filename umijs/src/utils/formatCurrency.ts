import { getLocale } from '@umijs/max';

// 映射语言到默认货币
const currencyMap: Record<string, string> = {
  en: 'USD',
  'en-US': 'USD',
  zh: 'CNY',
  'zh-CN': 'CNY',
};

/**
 * 根据语言环境获取对应的货币
 * @param {string} locale 当前语言环境
 * @returns {string} 对应的货币代码
 */
function getCurrencyByLocale(locale: string): string {
  if (currencyMap[locale]) {
    return currencyMap[locale];
  }
  const baseLocale = locale.split('-')[0];
  return currencyMap[baseLocale] || 'USD'; // 默认使用 USD
}

/**
 * 返回格式化后的货币字符串
 * @param {number} value 金额
 * @param {string} [locale] - 可选语言（默认使用当前浏览器语言）
 * @returns {string} 本地化的货币字符串
 */
export default function formatCurrency(value: number, locale?: string): string {
  const currentLocale = locale || getLocale();
  const currency = getCurrencyByLocale(currentLocale);

  return new Intl.NumberFormat(currentLocale, {
    style: 'currency',
    currency,
  }).format(value);
}
