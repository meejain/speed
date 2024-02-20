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
    console.log(JSON.stringify(data));
  } catch (error) {
    console.error('CrUXApiUtil.query failed', error);
  }
};

  async function mainfunction() {
    CrUXApiUtil.query({
      origin: 'https://www.cunacouncils.org'
    });
  }

 mainfunction();