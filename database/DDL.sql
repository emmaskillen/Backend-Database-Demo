-- MySQL Workbench Forward Engineering

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Create Insurances Table
-- -----------------------------------------------------
CREATE TABLE `Insurances` (
  `id_insurance` INT NOT NULL AUTO_INCREMENT,
  `org_name` VARCHAR(145) NOT NULL,
  `member_id` VARCHAR(145) NOT NULL,
  `group_number` VARCHAR(145) NULL,
  PRIMARY KEY (`id_insurance`),
  UNIQUE INDEX `id_insurance_UNIQUE` (`id_insurance` ASC) VISIBLE,
  UNIQUE INDEX `member_id_UNIQUE` (`member_id` ASC) VISIBLE)
ENGINE = InnoDB;

-- Add Insurances Data 
INSERT INTO `Insurances` (`org_name`, `member_id`, `group_number`) VALUES
('Regence', 'ZHK45325678', '003457'),
('UnitedHealthcare', '67854389', '65435'),
('Aetna', '9543278541', '18123840100001'),
('Kaiser Permanente', '0456754', '04531302');


-- -----------------------------------------------------
-- Create Patients Table
-- -----------------------------------------------------
CREATE TABLE `Patients` (
  `id_patient` INT NOT NULL AUTO_INCREMENT,
  `id_insurance` INT NULL,
  `last_name` VARCHAR(145) NOT NULL,
  `first_name` VARCHAR(145) NOT NULL,
  `birthdate` DATE NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `email` VARCHAR(145) NULL,
  `street_name` VARCHAR(145) NOT NULL,
  `city` VARCHAR(145) NOT NULL,
  `zip_code` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id_patient`),
  UNIQUE INDEX `id_insurance_UNIQUE` (`id_insurance` ASC) VISIBLE,
  CONSTRAINT `id_insurance`
    FOREIGN KEY (`id_insurance`)
    REFERENCES `Insurances` (`id_insurance`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- Add Patient Data
INSERT INTO `Patients` (`id_insurance`, `last_name`, `first_name`, `birthdate`, `phone_number`, `email`, `street_name`, `city`, `zip_code`) VALUES
((SELECT `id_insurance` FROM `Insurances` WHERE `member_id`='9543278541'), 'Smith', 'Rebecca', '2001-02-03', '2065550102', 'beckysmith@domain.com', '342 Big Road St', 'Seattle', '98117'),
((SELECT `id_insurance` FROM `Insurances` WHERE `member_id`='0456754'), 'Johnson', 'Tom', '1995-06-03', '4255550190', 'tommyboy@domain.com', '4524 56th St', 'Bellevue', '98004'),
((SELECT `id_insurance` FROM `Insurances` WHERE `member_id`='67854389'), 'Stone', 'Emily', '1967-04-27', '2065550150', 'stonewalls@domain.com', '4532 NW 51st St', 'Seattle', '98105'),
( NULL, 'Glass', 'Bobby', '2005-05-01', '2065550110', 'glassman@domain.com', '235 E Mercer St', 'Seattle', '98036');

-- -----------------------------------------------------
-- Create Staff Table
-- -----------------------------------------------------
CREATE TABLE `Staff` (
  `id_staff` INT NOT NULL AUTO_INCREMENT,
  `last_name` VARCHAR(145) NOT NULL,
  `first_name` VARCHAR(145) NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  `email` VARCHAR(145) NOT NULL,
  PRIMARY KEY (`id_staff`))
ENGINE = InnoDB;

-- Add Staff Data
INSERT INTO `Staff` (`last_name`, `first_name`, `phone_number`, `email`) VALUES
('Baker', 'Nancy', '2065550100', 'baker.nancy@domain.com'),
('Honna', 'Linda', '2065550125', 'honnagal@domain.com'),
('Bates', 'Brad', '4255550101', 'bates.brad32@domain.com');

-- -----------------------------------------------------
-- Create Appointments Table
-- -----------------------------------------------------
CREATE TABLE `Appointments` (
  `id_appointment` INT NOT NULL AUTO_INCREMENT,
  `id_patient` INT NOT NULL,
  `id_staff` INT NOT NULL,
  `appointment_date` DATE NOT NULL,
  `appointment_time` TIME NOT NULL,
  `visit_purpose` VARCHAR(245) NOT NULL,
  PRIMARY KEY (`id_appointment`),
  UNIQUE INDEX `id_appointment_UNIQUE` (`id_appointment` ASC) VISIBLE,
  FOREIGN KEY (`id_patient`) REFERENCES `Patients` (`id_patient`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`id_staff`) REFERENCES `Staff` (`id_staff`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE = InnoDB;

-- Add Appointments Data
INSERT INTO `Appointments` (`id_patient`, `id_staff`, `appointment_date`, `appointment_time`, `visit_purpose`) VALUES
((SELECT `id_patient` FROM `Patients` WHERE `last_name` = 'Stone' AND `first_name` = 'Emily'), 
(SELECT  `id_staff` FROM `Staff` WHERE `last_name` = 'Honna' AND `first_name` = 'Linda'), '2021-04-30', '10:45:00', 'Patient is overdue for annual exam.'),
((SELECT `id_patient` FROM `Patients` WHERE `last_name` = 'Glass' AND `first_name` = 'Bobby'), 
(SELECT  `id_staff` FROM `Staff` WHERE `last_name` = 'Baker' AND `first_name` = 'Nancy'), '2022-11-13', '09:30:00', 'Patient suffered a brain injury and needs evaluation.'),
((SELECT `id_patient` FROM `Patients` WHERE `last_name` = 'Johnson' AND `first_name` = 'Tom'), 
(SELECT  `id_staff` FROM `Staff` WHERE `last_name` = 'Bates' AND `first_name` = 'Brad'), '2023-01-01', '13:00:00', 'Routine blood panel.'),
((SELECT `id_patient` FROM `Patients` WHERE `last_name` = 'Johnson' AND `first_name` = 'Tom'), 
(SELECT  `id_staff` FROM `Staff` WHERE `last_name` = 'Baker' AND `first_name` = 'Nancy'), '2023-03-02', '07:15:00', 'Patient had a seizure.');

-- -----------------------------------------------------
-- Create Codes Table
-- -----------------------------------------------------
CREATE TABLE `Codes` (
  `id_code` INT NOT NULL AUTO_INCREMENT,
  `cpt_code` VARCHAR(145) NOT NULL,
  `description` VARCHAR(245) NULL,
  `initial_fee` DECIMAL(19,2) NOT NULL,
  PRIMARY KEY (`id_code`))
ENGINE = InnoDB;

-- Add Codes Data
INSERT INTO `Codes` (`cpt_code`, `description`, `initial_fee`) VALUES
('99201', 'Physical Exam', 342.50),
('95812', 'EEG 41-60 Minutes', 855.40),
('85025', 'CBC Blood Count with Differential', 400.99),
('96139', 'Neuropsychological Test', 1000.00);

-- -----------------------------------------------------
-- Create appointments_has_codes (interaction table)
-- -----------------------------------------------------
CREATE TABLE `appointments_has_codes` (
  `id_appointment` INT NOT NULL,
  `id_code` INT NOT NULL,
  PRIMARY KEY (`id_appointment`, `id_code`),
  CONSTRAINT `fk_Appointments_has_CPT Codes_Appointments1`
    FOREIGN KEY (`id_appointment`)
    REFERENCES `Appointments` (`id_appointment`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Appointments_has_CPT Codes_CPT Codes1`
    FOREIGN KEY (`id_code`)
    REFERENCES `Codes` (`id_code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;

-- Add appointments_has_codes data
INSERT INTO `appointments_has_codes` (`id_appointment`, `id_code`) VALUES (
(SELECT `id_appointment` FROM `Appointments` WHERE `appointment_date` = '2021-04-30' AND `appointment_time` = '10:45:00'),
(SELECT `id_code` FROM `Codes` WHERE `description` = 'Physical Exam')
);

INSERT INTO `appointments_has_codes` (`id_appointment`, `id_code`) VALUES (
(SELECT `id_appointment` FROM `Appointments` WHERE `appointment_date` = '2022-11-13' AND `appointment_time` = '9:30:00'),
(SELECT `id_code` FROM `Codes` WHERE `description` = 'Neuropsychological Test')
);

INSERT INTO `appointments_has_codes` (`id_appointment`, `id_code`) VALUES (
(SELECT `id_appointment` FROM `Appointments`  WHERE `appointment_date` = '2023-01-01' AND `appointment_time` = '13:00:00'),
(SELECT `id_code` FROM `Codes` WHERE `description` = 'Physical Exam')
);

INSERT INTO `appointments_has_codes` (`id_appointment`, `id_code`) VALUES (
(SELECT `id_appointment` FROM `Appointments`  WHERE `appointment_date` = '2023-03-02' AND `appointment_time` = '7:15:00'),
(SELECT `id_code` FROM `Codes` WHERE `description` = 'EEG 41-60 Minutes')
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;