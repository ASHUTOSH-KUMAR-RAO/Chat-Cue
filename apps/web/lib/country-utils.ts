import * as ct from "countries-and-timezones";

export const getCountryFromTimezone = ({ timezone }: { timezone?: string }) => {
  if (!timezone) {
    return null;
  }

  const timeszoneInfo = ct.getTimezone(timezone);
  if (!timeszoneInfo?.countries.length) {
    return null;
  }

  const countryCode = timeszoneInfo.countries[0];

  const country = ct.getCountry(countryCode as string);

  return {
    code: countryCode,
    name: country?.name || countryCode,
  };
};


export const getCountaryFlagUrl = ({countryCode}:{countryCode:string})=>{

  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`
}

// https://flagcdn.com,ye ek bhramastra website jaha se humko sabhi company ke flag mill jayenge
