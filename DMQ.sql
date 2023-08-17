-- 340 Project
-- Brynn DeVaan and Emma Skillen
-- :: denotes data that will come from backend and user input.

/*
Manipulating Patients table: 
*/
-- SELECT -- individual patient data for updating form
SELECT `id_insurance`, `last_name`, `first_name`, `birthdate`, `phone_number`, 
`email`, `street_name`, `city`, `zip_code` FROM `Patients` WHERE
`id_patient` = `id_patient_selected_from_table`; 

-- SELECT -- getting insurance ID for drop menu to match with patient insurance
SELECT `id_insurance`, `org_name` FROM `Primary Insurances`;  

-- INSERT -- adding new patient (new patient form), using drop down menu (above) for insurance id 
INSERT INTO `Patients` (`id_insurance`, `last_name`, `first_name`, `birthdate`, `phone_number`, 
`email`, `street_name`, `city`, `zip_code`)
VALUES (`::id_insurance_from_drop_down_input`, `::last_name_input`, `::first_name_input`, `::birthdate_input`, `::phone_number_input`, 
`::email_input`, `::street_name_input`, `::city_input`, `::zip_code_input`);

-- UPDATE -- patient information with data from update patient form
UPDATE `Patients` SET `id_insurance` = `::id_insurance_from_drop_down_input`, `last_name` = `::last_name_input`,
`first_name` = `::first_name_input`, `birthdate` = `::birthdate_input`, `phone_number` = `::phone_number_input`,
`email` = `::email_input`, `street_name` = `::street_name_input`, `city` = `::city_input`, `zip_code` = `::zip_code_input`
WHERE `id_patient` = `::id_patient_from_update_form`;

-- DELETE -- selected patient from Patient table
DELETE FROM `Patients` WHERE `id_patient` = `::id_patient_selected_from_table`;





/*
Manipulating Staff table: 
*/
-- SELECT -- individual staff row for updating form
SELECT `last_name`, `first_name`, `phone_number`, `email` FROM `Staff`
WHERE `id_staff` = `id_staff_selected_from_table`;

-- INSERT -- new staff member. 
INSERT INTO `Staff` (`last_name`, `first_name`, `phone_number`, `email`)
VALUES (`::last_name_input`, `::first_name_input`, `::phone_number_input`, `::email_input`)

-- UPDATE -- updating staff info from update form on Staff Page
UPDATE `Staff` SET  `last_name` = `::last_name_input`,
`first_name` = `::first_name_input`, `phone_number` = `::phone_number_input`, `email` = `::email_input`
WHERE `id_staff` = `id_staff_from_update_form`

-- DELETE -- Remove staff with selected id from table 
DELETE FROM `Staff` WHERE `id_staff` = `::id_staff_selected_from_table`;






/*
Manipulating Insurance table: 
*/
-- SELECT single row of patient insurance plan, for updating form 
SELECT `org_name`, `member_id`, `group_number` FROM `Primary Insurances`
WHERE `id_insurance` = `::id_insurance_selected_from_table`;

-- INSERT -- adding new insurance type to database
INSERT INTO `Primary Insurances` (`org_name`, `member_id`, `group_number`)
VALUES (`::org_name_input`, `::member_id_input`, `::group_number_input`)

-- UPDATE -- update insurance plan information of patient on update form
UPDATE `Primary Insurances` SET `org_name` = `::org_name_input`, `group_number` = `::group_number_input` 
WHERE `id_insurance` = `::id_insurance_from_update_form`; 

-- DELETE -- remove insurance with matching id from selected table
DELETE FROM `Primary Insurances` WHERE `id_insurance` = `::id_insurance_selected_from_table`;





/*
Manipulating CPT Codes table: 
*/
-- SELECT single row of code data, for updating form 
SELECT `cpt_code`, `description`, `initial_fee` FROM `CPT Codes` WHERE
`id_code` = `::id_code_selected_from_table`; 

-- INSERT new cpt code to system 
INSERT INTO `CPT Codes` (`cpt_code`, `description`, `initial_fee`)
VALUES (`::cpt_code_input`, `::description_input`, `::initial_fee_input`);

-- UPDATE cpt code details on update form
UPDATE `CPT Codes` SET `cpt_code` = `::cpt_code_input`, `description` = `::description_input`,
`initial_fee` = `::initial_fee_input` 
WHERE `id_code` = `::id_code_from_update_form`;

-- DELETE -- delete cpt code entry matching chosen from table 
DELETE FROM `CPT Codes` WHERE `id_code` = `::id_code_selected_from_table`;





/*
Manipulating Appointments table: 
*/
-- SELECT -- get single appointment data for updating appointment form
SELECT `id_patient`, `id_staff`, `appointment_date`, `appointment_time`, 
`visit_purpose` FROM `Appointments` WHERE `id_appointment` = `::id_appointment_selected_from_table`;

-- SELECT -- drop down menu for patient id on appointment page
SELECT `id_patient`, `last_name`, `first_name` FROM `Patients`;

-- SELECT -- drop down menu for staff id on appointment page
SELECT `id_staff`, `last_name`, `first_name` FROM `Staff`;

-- INSERT: create new appointment, handling two drop down options (patients and staff)
INSERT INTO `Appointments` (`id_patient`, `id_staff`, `appointment_date`, `appointment_time`, 
`visit_purpose`)
VALUES (`::id_patient_from_dropdown_input`, `::id_staff_from_dropdown_input`, `::appointment_date_input`,
`::apointment_time_input`, `::visit_purpose_input`);

-- UPDATE appointment data on update form 
UPDATE `Appointments` SET `id_patient` = `::id_patient_from_dropdown_input`, 
`id_staff` = `::id_staff_from_dropdown_input`, `appointment_date` = `::appointment_date_input`,
`appointment_time` = `::appointment_time_input`, `visit_purpose` = `::visit_purpose_input`
WHERE `id_appointment` = `::id_appointment_from_update_form`; 

-- DELETE -- delete appointment with matching id from table
DELETE FROM `Appointments` WHERE `id_appointment` = `::id_appointment_selected_from_table`;





/*
Manipulating Appointment Codes table (intersection table): 
*/

-- SELECT -- display table for appointment and code id's (M:M)
SELECT `Appointment`.`id_appointment`, `CPT Codes`.`id_code`
FROM `Appointments` 
INNER JOIN `CPT Codes` ON `Appointments`.`id_code`=`CPT Code`.`id_code`;

-- INSERT -- M:M relationship between appointment and code, 2 drop down menus
INSERT INTO `appointments_has_codes` (`id_appointment`, `id_code`)
VALUES (`::id_appointment_from_dropdown_input`, `::id_code_from_dropdown_input`)

-- DELETE -- Disassociate M:M relationship between appointment and CPT code
DELETE FROM `appointments_has_codes` WHERE `id_appointment` = `::id_appointment_selected_from_table` 
AND `id_code` = `::id_code_selected_from_table`; 