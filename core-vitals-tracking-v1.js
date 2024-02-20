const CrUXApiUtil = {};
// Get your CrUX API key at https://goo.gle/crux-api-key.
CrUXApiUtil.API_KEY = 'AIzaSyCvoXFk31F4fCScVaoDoZiZ-J2pKU7fTHw';
CrUXApiUtil.API_ENDPOINT = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${CrUXApiUtil.API_KEY}`;
CrUXApiUtil.query = async function (requestBody) {
  console.log(requestBody);
  try {
    const response =  await fetch(CrUXApiUtil.API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    assessCoreWebVitals(data);
  } catch (error) {
    console.error('CrUXApiUtil.query failed', error);
  } 
};

function assessCoreWebVitals(response) {
    const CORE_WEB_VITALS = [
        'largest_contentful_paint',
        'first_input_delay',
        'cumulative_layout_shift'
      ];
      CORE_WEB_VITALS.forEach((metric) => {
        const result = JSON.stringify(response.record.metrics[metric]);
        if (!result) {
          console.log(`No data for ${metric}`);
          return;
        } else {
            const p75 = JSON.stringify(response.record.metrics[metric].percentiles.p75);
            const threshold = JSON.stringify(response.record.metrics[metric].histogram[0].end);
            console.log(metric, "=" ,threshold, p75);
        }
      });
}

  async function mainfunction() {
    CrUXApiUtil.query({
      origin: 'https://www.cunacouncils.org'
    });
  }

 mainfunction();