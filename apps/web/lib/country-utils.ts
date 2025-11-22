import * as ct from "countries-and-timezones";

export const getCountryFromTimezone = ({ timezone }: { timezone?: string }) => {
  if (!timezone) {
    return null;
  }

  const timezoneInfo = ct.getTimezone(timezone);
  if (!timezoneInfo?.countries.length) {
    return null;
  }

  const countryCode = timezoneInfo.countries[0] as string;
  const country = ct.getCountry(countryCode);

  return {
    code: countryCode,
    name: country?.name || countryCode,
  };
};

export const getCountryFlagUrl = ({ countryCode }: { countryCode: string }) => {
  // Ensure country code is valid and exactly 2 characters (ISO alpha-2)
  if (!countryCode || countryCode.length !== 2) {
    return null;
  }

  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

// Usage with error handling:
export const getFlagForTimezone = (timezone?: string) => {
  const countryInfo = getCountryFromTimezone({ timezone });

  if (!countryInfo) {
    return null;
  }

  return getCountryFlagUrl({ countryCode: countryInfo.code });
};

// https://flagcdn.com,ye ek bhramastra website jaha se humko sabhi company ke flag mill jayenge
