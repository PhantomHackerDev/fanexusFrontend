const REPORT_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSegbMaXc56dg-sartNIWGMEeDaLA8I1laKrdfrPg92ZFVN9kQ/viewform';
const formFields = {
  alias: 'entry.1322568328',
  url: 'entry.1588481968'
};

const reportFormParams = data =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [formFields[key], value])
  );

export const reportFormUrl = data => {
  const url = new URL(REPORT_FORM_URL);
  url.search = new URLSearchParams(reportFormParams(data));
  return url.toString();
};
