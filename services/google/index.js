export const createNewCampaign = async (customerId, client) => {
  const customer = client.Customer({
    customer_id: customerId,
  });

  const budgetResourceName = await createBudget(customer);

  const campaign = {
    name: "Kampanye Contoh",
    status: "PAUSED",
    advertising_channel_type: "SEARCH",
    manual_cpc: {},
    campaign_budget: budgetResourceName,
  };

  const operation = {
    create: campaign,
  };

  const response = await customer.campaigns.create([operation]);

  console.log(
    `Kampanye dibuat dengan resource name: ${response.results[0].resource_name}`
  );
};
export const createBudget = async (customer) => {
  const budget = {
    name: "Contoh Anggaran",
    amount_micros: 500 * 1000000,
    delivery_method: "STANDARD",
    explicitly_shared: true,
  };

  const operation = {
    create: budget,
  };

  const response = await customer.campaignBudgets.create([operation]);

  return response.results[0].resource_name;
};
