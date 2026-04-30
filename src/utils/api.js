const isDev = import.meta.env.DEV;

export const YAHOO_QUERY1_BASE = isDev ? "/yahoo-query1" : "https://query1.finance.yahoo.com";
export const YAHOO_QUERY2_BASE = isDev ? "/yahoo-query2" : "https://query2.finance.yahoo.com";
