-- Demo seed for new households (mirrors mock seed content; dates relative to signup day)

create or replace function public.seed_demo_household_data(p_household_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_heating_id uuid := gen_random_uuid();
  v_washing_id uuid := gen_random_uuid();
  v_dishwasher_id uuid := gen_random_uuid();
  v_router_id uuid := gen_random_uuid();
  v_contract_electricity uuid := gen_random_uuid();
  v_contract_internet uuid := gen_random_uuid();
  v_contract_insurance uuid := gen_random_uuid();
  v_contract_mobile uuid := gen_random_uuid();
begin
  insert into public.home_items (
    id, household_id, name, category, manufacturer, model, serial_number, location,
    purchase_date, installation_date, purchase_price_cents, currency,
    warranty_ends_at, last_maintenance_at, next_maintenance_at, notes
  ) values
    (
      v_heating_id, p_household_id, 'Heizungsanlage', 'heating', 'Viessmann', 'Vitodens 200-W',
      'VD-2019-88421', 'Keller, Technikraum', null, '2019-11-12', 890000, 'EUR',
      '2024-11-12', current_date - 21, current_date + 14,
      'Jährliche Wartung durch Haustechnik Weber. Beispieldaten — bearbeiten oder löschen.'
    ),
    (
      v_washing_id, p_household_id, 'Waschmaschine', 'appliances', 'Bosch', 'WAN28209',
      'BSH-WM-7721', 'Bad', '2024-09-20', null, 69900, 'EUR',
      current_date + interval '1 year', null, null,
      'Energieeffizienz A, 9 kg.'
    ),
    (
      v_dishwasher_id, p_household_id, 'Geschirrspüler', 'kitchen', 'Siemens', 'SN65IX00CE',
      null, 'Küche', '2022-03-14', null, 54900, 'EUR',
      '2024-03-14', null, null, null
    ),
    (
      v_router_id, p_household_id, 'Internet-Router', 'internet', 'Telekom', 'Speedport Smart 4',
      null, 'Wohnzimmer', null, '2023-06-01', null, 'EUR',
      null, null, null, 'Glasfaser-Anschluss, Mesh-fähig.'
    );

  insert into public.contracts (
    id, household_id, name, provider, category, cost_cents, currency, payment_interval,
    start_date, minimum_term_months, notice_period_days, next_cancellation_date,
    auto_renewal, contract_end_date, notes
  ) values
    (
      v_contract_electricity, p_household_id, 'Strom Grundversorgung', 'Vattenfall', 'electricity',
      8900, 'EUR', 'monthly', '2025-01-01', 12, 30, current_date + 21, true, null,
      'Tarif prüfen, Preisgarantie endet Ende 2026.'
    ),
    (
      v_contract_internet, p_household_id, 'Internet & Festnetz', 'Telekom', 'internet',
      4999, 'EUR', 'monthly', '2023-06-01', 24, 30, current_date + 10, true, '2027-05-31', null
    ),
    (
      v_contract_insurance, p_household_id, 'Wohngebäudeversicherung', 'Allianz', 'insurance',
      42000, 'EUR', 'yearly', '2024-10-28', 12, 90, current_date + 90, true, current_date + 365, null
    ),
    (
      v_contract_mobile, p_household_id, 'Mobilfunk', 'O2', 'mobile',
      2999, 'EUR', 'monthly', '2025-03-01', 24, 30, null, true, null, null
    );

  insert into public.documents (
    household_id, title, document_type, issued_at, mock_file_name, mock_file_size_bytes,
    link_type, link_target_id, notes
  ) values
    (
      p_household_id, 'Rechnung Heizungswartung 2025', 'invoice', current_date - 30,
      'heizung-wartung-2025.pdf', 245000, 'home_item', v_heating_id, null
    ),
    (
      p_household_id, 'Garantie Waschmaschine', 'warranty', '2024-09-20',
      'bosch-garantie-waschmaschine.pdf', 128000, 'home_item', v_washing_id, null
    ),
    (
      p_household_id, 'Internetvertrag Telekom', 'contract', '2023-05-28',
      'telekom-internet-vertrag.pdf', 512000, 'contract', v_contract_internet, null
    );

  insert into public.reminders (
    household_id, title, due_date, status, priority, link_type, link_target_id, notes
  ) values
    (
      p_household_id, 'Heizung warten', current_date + 14, 'upcoming', 'high', 'home_item',
      v_heating_id, 'Termin bei Haustechnik Weber anfragen.'
    ),
    (
      p_household_id, 'Stromvertrag prüfen', current_date - 3, 'due', 'medium', 'contract',
      v_contract_electricity, 'Kündigungsfenster und Preisgarantie vergleichen.'
    ),
    (
      p_household_id, 'Garantie Waschmaschine prüfen', current_date - 1, 'due', 'low', 'home_item',
      v_washing_id, null
    );
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id uuid;
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(coalesce(new.email, 'user'), '@', 1)
    )
  );

  insert into public.households (name)
  values ('Mein Haushalt')
  returning id into new_household_id;

  insert into public.household_members (household_id, user_id, role)
  values (new_household_id, new.id, 'owner');

  perform public.seed_demo_household_data(new_household_id);

  return new;
end;
$$;
