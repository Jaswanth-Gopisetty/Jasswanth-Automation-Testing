import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  const uid = Date.now().toString().slice(-6);
  const trainingTitle = `Testing playwright ${uid}`;

  await page.goto('http://localhost:3000/login');
  await page.getByRole('textbox', { name: 'UserName' }).click();
  await page.getByRole('textbox', { name: 'UserName' }).fill('jaswanth');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Jaswanth');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'UserName' }).click();
  await page.getByRole('textbox', { name: 'UserName' }).fill('testuser');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'UserName' }).click();
  await page.getByRole('textbox', { name: 'UserName' }).fill('testuser');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Password@123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.locator('.relative.p-4.bg-white.rounded-md.shadow-md.hover\\:shadow-lg.transition-all.cursor-pointer.border-2.min-w-\\[250px\\].border-green-500 > .flex.items-center.justify-between > .flex-1 > .flex').click();
  await page.getByRole('link', { name: 'Training Manage training' }).click();
  await page.getByRole('link').filter({ hasText: /^$/ }).click();
  await page.getByRole('link', { name: 'Training Manage training' }).click();
  await page.locator('.flex.items-center.justify-between.px-3.py-2.text-sm.font-medium.rounded-lg.transition-colors.bg-blue-50 > .ml-2').click();
  await page.locator('.flex.items-center.justify-between.px-3.py-2.text-sm.font-medium.rounded-lg.transition-colors.bg-blue-50 > .ml-2').click();
  await page.locator('.flex.items-center.justify-between.px-3.py-2.text-sm.font-medium.rounded-lg.transition-colors.bg-blue-50 > .ml-2').click();
  await page.getByRole('link', { name: '12 Courses Training Browse' }).click();
  await page.getByRole('textbox', { name: 'Search trainings by title,' }).click();
  await page.goto('http://localhost:3000/training/catalogue');
  await page.getByText('DashboardContentTrainingTrainingTrainersTrainer ListTrainee AccountsTraining').click();
  await page.getByText('DashboardContentTrainingTrainingTrainersTrainer ListTrainee AccountsTraining').click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Training Manage training' }).click();
  await page.getByRole('link', { name: '12 Courses Training Browse' }).click();
  await page.getByRole('textbox', { name: 'Search trainings by title,' }).click();
  await page.getByRole('textbox', { name: 'Search trainings by title,' }).fill('Testing123');
  await page.locator('.absolute.inset-y-0.right-0').click();
  await page.getByRole('textbox', { name: 'Search trainings by title,' }).click();
  await page.getByRole('textbox', { name: 'Search trainings by title,' }).fill('');
  await page.getByRole('button', { name: 'Filters (5 available)' }).click();
  await page.getByRole('button', { name: 'All Status 3 options' }).click();
  await page.getByRole('button', { name: 'Inactive', exact: true }).click();
  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.getByRole('button', { name: 'Filters (5 available)' }).click();
  await page.getByRole('button', { name: 'All Status 3 options' }).click();
  await page.getByRole('button', { name: 'Archived' }).click();
  await page.getByRole('button', { name: '×' }).click();
  await page.getByRole('button', { name: 'Filters (5 available)' }).click();
  await page.getByRole('button', { name: 'All Status 3 options' }).click();
  await page.getByRole('button', { name: 'Draft' }).click();
  await page.getByRole('button', { name: 'Filters (4 available)' }).click();
  await page.getByRole('button', { name: 'All Categories 3 options' }).click();
  await page.getByRole('button', { name: 'Safety & Health' }).click();
  await page.getByRole('button', { name: 'Filters (3 available)' }).click();
  await page.getByRole('button', { name: 'All Types 1 options' }).click();
  await page.getByRole('button', { name: 'Mandatory' }).click();
  await page.getByRole('button', { name: 'Filters (2 available)' }).click();
  await page.getByRole('button', { name: 'All Groups 100 options' }).click();
  await page.getByRole('button', { name: 'test', exact: true }).click();
  await page.getByRole('button', { name: 'Filters (1 available)' }).click();
  await page.getByRole('button', { name: 'All Departments 21 options' }).click();
  await page.getByRole('button', { name: 'General' }).click();
  await page.getByRole('button', { name: 'Clear all' }).click();
  await page.getByRole('button', { name: 'Go to page 2' }).click();
  await page.getByRole('button', { name: 'Go to page 3' }).click();
  await page.getByRole('button', { name: 'Go to page 1', exact: true }).click();
  await page.getByRole('navigation', { name: 'Pagination' }).click();
  await page.getByRole('button', { name: 'Go to page 1', exact: true }).click();
  await page.getByRole('navigation', { name: 'Pagination' }).click();
  await page.getByRole('button', { name: 'Go to page 10' }).click();
  await page.getByRole('navigation', { name: 'Pagination' }).click();
  await page.getByRole('navigation', { name: 'Pagination' }).click();
  await page.getByRole('navigation', { name: 'Pagination' }).click();
  await page.getByRole('navigation', { name: 'Pagination' }).click();
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await page.locator('.text-white.hover\\:bg-white\\/20').click();
  await page.getByRole('button', { name: 'Create Training' }).click();
  await page.getByRole('textbox', { name: 'e.g., Safety Protocols' }).click();
  await page.getByRole('textbox', { name: 'e.g., Safety Protocols' }).fill('Testing Purpose');
  await page.getByRole('textbox', { name: 'Provide a comprehensive' }).click();
  await page.getByRole('textbox', { name: 'Provide a comprehensive' }).fill('Testing for Playwright');
  await page.getByRole('combobox').first().selectOption('a0070002-0000-0000-0000-000000000001');
  await page.getByRole('combobox').nth(1).selectOption('a0070011-0000-0000-0000-000000000002');
  await page.getByRole('combobox').nth(3).selectOption('fe078ba3-adb4-4a46-8b8b-c1c805fc55d5');
  await page.getByPlaceholder('0-').first().click();
  await page.getByPlaceholder('0-').first().fill('2');
  await page.getByPlaceholder('0-').nth(1).click();
  await page.getByPlaceholder('0-').first().click();
  await page.getByRole('combobox').nth(4).selectOption('days');
  await page.getByPlaceholder('0-').nth(1).click();
  await page.getByPlaceholder('0-').nth(1).fill('15');
  await page.getByRole('checkbox', { name: 'Arun Joshi DepartmentHead •' }).check();
  await page.getByRole('checkbox', { name: 'Meena Reddy QualityAssurance' }).check();
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).click();
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).fill('jaswanth');
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).fill('rajinikanth');
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).fill('neha guptha');
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).fill('');
  await page.getByRole('button', { name: 'Add New Trainer' }).click();
  await page.getByRole('textbox', { name: 'Enter trainer\'s full name' }).click();
  await page.getByRole('textbox', { name: 'Enter trainer\'s full name' }).fill('Jaswanth');
  await page.getByRole('textbox', { name: 'e.g., GMP Trainer, Safety' }).click();
  await page.getByRole('textbox', { name: 'e.g., GMP Trainer, Safety' }).fill('A-Testing');
  await page.locator('.p-6 > div:nth-child(4) > .w-full').selectOption('Quality Assurance');
  await page.getByRole('textbox', { name: 'trainer@company.com' }).click();
  await page.getByRole('textbox', { name: 'trainer@company.com' }).fill('Jaswanth@Aurexa.com');
  await page.getByRole('button', { name: 'US +' }).click();
  await page.getByRole('button', { name: 'IN +' }).click();
  await page.getByRole('textbox', { name: 'Enter phone number' }).click();
  await page.getByRole('textbox', { name: 'Enter phone number' }).fill('9999999999');
  await page.getByRole('button', { name: 'Add Trainer' }).click();
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).click();
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).fill('jaswa');
  await page.getByRole('button', { name: 'Add New Trainer' }).click();
  await page.getByText('External', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Enter trainer\'s full name' }).click();
  await page.getByRole('textbox', { name: 'Enter trainer\'s full name' }).fill('Jaswanth');
  await page.getByRole('textbox', { name: 'e.g., GMP Trainer, Safety' }).click();
  await page.getByRole('textbox', { name: 'e.g., GMP Trainer, Safety' }).fill('quality');
  await page.locator('.p-6 > div:nth-child(4) > .w-full').selectOption('Quality Assurance');
  await page.getByRole('textbox', { name: 'trainer@company.com' }).click();
  await page.getByRole('textbox', { name: 'trainer@company.com' }).fill('jaswanth@aurexa.com');
  await page.getByRole('button', { name: 'US +' }).click();
  await page.getByRole('button', { name: 'IN +' }).click();
  await page.getByRole('textbox', { name: 'Enter phone number' }).click();
  await page.getByRole('textbox', { name: 'Enter phone number' }).fill('9999999999');
  await page.getByRole('button', { name: 'Add Trainer' }).click();
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).click();
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).fill('');
  await page.goto('http://localhost:3000/training/catalogue');
  await page.getByRole('button', { name: 'Create Training' }).click();
  await page.getByRole('textbox', { name: 'e.g., Safety Protocols' }).click();
  await page.getByRole('textbox', { name: 'e.g., Safety Protocols' }).fill(trainingTitle);
  await page.getByRole('textbox', { name: 'Provide a comprehensive' }).click();
  await page.getByRole('textbox', { name: 'e.g., Safety Protocols' }).click();
  await page.getByRole('textbox', { name: 'e.g., Safety Protocols' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'e.g., Safety Protocols' }).press('ControlOrMeta+c');
  await page.getByRole('textbox', { name: 'Provide a comprehensive' }).click();
  await page.getByRole('textbox', { name: 'Provide a comprehensive' }).fill('Testing playwright');
  await page.getByRole('combobox').first().selectOption('a0070002-0000-0000-0000-000000000001');
  await page.getByRole('combobox').nth(1).selectOption('a0070011-0000-0000-0000-000000000002');
  await page.getByRole('combobox').nth(3).selectOption('fe078ba3-adb4-4a46-8b8b-c1c805fc55d5');
  await page.getByRole('combobox').nth(2).selectOption('Self-Learning');
  await page.getByRole('combobox').nth(2).selectOption('Instructor-led');
  await page.getByPlaceholder('0-').first().click();
  await page.getByPlaceholder('0-').first().fill('2');
  await page.getByPlaceholder('0-').nth(1).click();
  await page.getByPlaceholder('0-').nth(1).fill('15');
  await page.getByRole('combobox').nth(5).selectOption('minutes');
  await page.getByRole('combobox').nth(5).selectOption('hours');
  await page.getByRole('combobox').nth(4).selectOption('days');
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).click();
  await page.getByRole('textbox', { name: 'Search trainer by name, email' }).fill('');
  await page.getByRole('checkbox', { name: 'Arun Joshi DepartmentHead •' }).check();
  await page.getByRole('checkbox', { name: 'Meena Reddy QualityAssurance' }).check();
  await page.locator('input[type="file"]').setInputFiles('TMS- CV Resume - TEST SCENARIOS.xlsx');
  await page.locator('input[type="file"]').setInputFiles('TMS- CV Resume - TEST SCENARIOS (filled).xlsx');
  await page.getByRole('button', { name: 'Remove file' }).nth(1).click();
  await page.getByRole('button', { name: 'Remove file' }).click();
  await page.locator('input[type="file"]').setInputFiles('TMS - TRAINING CREATION - TEST SCENARIOS (2).xlsx');
  await page.getByRole('checkbox', { name: 'Exam Required' }).check();
  await page.getByRole('textbox', { name: 'Search by exam name, type, or' }).click();
  await page.getByRole('textbox', { name: 'Search by exam name, type, or' }).fill('test');
  await page.getByRole('radio', { name: 'test123 EXAM-066 Draft' }).check();
  await page.locator('label').filter({ hasText: 'teststEXAM-061DraftTechnical' }).click();
  await page.getByRole('radio', { name: 'test123 EXAM-066 Draft' }).check();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('radio', { name: 'testst EXAM-061 Draft' }).check();
  await page.locator('label').filter({ hasText: 'test123EXAM-066DraftQuality' }).click();
  await page.locator('label').filter({ hasText: 'test123EXAM-066DraftQuality' }).click();
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await page.getByRole('radio', { name: 'testst EXAM-061 Draft' }).check();
  await page.getByPlaceholder('Enter value').click();
  await page.getByPlaceholder('Enter value').fill('102');
  await page.getByPlaceholder('Enter number').first().click();
  await page.getByPlaceholder('Enter number').first().fill('200');
  await page.getByPlaceholder('Enter number').nth(1).click();
  await page.getByPlaceholder('Enter number').nth(1).fill('1');
  await page.locator('div:nth-child(3) > div > .flex > .px-3.py-2.border.border-gray-300.rounded-lg.focus\\:ring-2.focus\\:ring-blue-500.bg-white').selectOption('years');
  await page.getByRole('checkbox', { name: 'Mandatory' }).uncheck();
  await page.getByRole('checkbox', { name: 'Mandatory' }).check();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).fill('testing playwright');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).press('ControlOrMeta+c');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).fill('testing playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwright');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).press('ControlOrMeta+c');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).fill('testing playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttetesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting plsting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwright');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).dblclick();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).dblclick();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).dblclick();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).click();
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).press('ArrowDown');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).press('ArrowDown');
  await page.getByRole('textbox', { name: 'Provide step-by-step' }).fill('testing playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttetesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting plsting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwright');
  await page.getByText('1000/1000 characters').click();
  await page.getByRole('button', { name: 'Advanced Settings' }).click();
  await page.getByRole('checkbox', { name: 'Training task must be' }).check();
  await page.getByRole('combobox', { name: 'e.g., QA Reviewer, Compliance' }).click();
  await page.getByRole('combobox', { name: 'e.g., QA Reviewer, Compliance' }).fill('QA Reviewer');
  await page.getByRole('combobox', { name: 'e.g., QA Reviewer, Compliance' }).click();
  await page.getByRole('combobox', { name: 'e.g., QA Reviewer, Compliance' }).dblclick();
  await page.locator('div').filter({ hasText: /^Allow trainees to voluntarily enroll in this course$/ }).nth(1).click();
  await page.getByRole('checkbox', { name: 'Allow trainees to voluntarily' }).check();
  await page.getByRole('checkbox', { name: 'Supervisor approval required' }).check();
  await page.getByRole('checkbox', { name: 'Require trainee to upload a' }).check();
  await page.getByRole('button', { name: 'Draft' }).click();
  await page.getByRole('textbox', { name: 'Search trainings by title,' }).click();
  await page.getByRole('textbox', { name: 'Search trainings by title,' }).fill(trainingTitle);
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await page.getByRole('button', { name: 'Edit Training' }).click();
  await page.getByRole('button', { name: 'Update Training' }).click();
  await page.getByRole('button', { name: 'View Details' }).first().click();
  await page.getByRole('button', { name: 'Edit Training' }).click();
  await page.getByPlaceholder('0-').nth(1).click();
  await page.getByPlaceholder('0-').nth(1).fill('150');
  await page.getByPlaceholder('0-').first().click();
  await page.getByPlaceholder('0-').first().fill('20');
  await page.getByRole('button', { name: 'Update Training' }).click();
  await page.getByRole('button', { name: 'Assign Training' }).first().click();
  await page.getByRole('button', { name: 'Assign Training' }).first().click();
  await page.getByRole('button', { name: 'Assign Training' }).first().click();
  await page.getByRole('button', { name: 'View History' }).first().click();
  await page.locator('.text-white\\/80').click();
  await page.getByRole('button', { name: 'Archive Training' }).first().click();
  await page.locator('canvas').click({
    position: {
      x: 235,
      y: 78
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 287,
      y: 143
    }
  });
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Archive Training' }).first().click();
  await page.locator('canvas').click({
    position: {
      x: 132,
      y: 84
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 118,
      y: 80
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 153,
      y: 98
    }
  });
  await page.locator('canvas').dblclick({
    position: {
      x: 294,
      y: 104
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 281,
      y: 89
    }
  });
  await page.locator('canvas').dblclick({
    position: {
      x: 236,
      y: 114
    }
  });
  await page.locator('canvas').dblclick({
    position: {
      x: 236,
      y: 114
    }
  });
  await page.getByRole('button', { name: 'Upload Signature' }).click();
  await page.getByText('Click to upload signature imagePNG, JPG, WEBP (max 5 MB)').click();
  await page.locator('input[type="file"]').setInputFiles('Gemini_Generated_Image_arxelparxelparxe.png');
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await page.getByRole('textbox', { name: 'Reason for archiving...' }).click();
  await page.getByRole('textbox', { name: 'Reason for archiving...' }).fill('testing playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwrighttesting playwr');
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await page.getByRole('button', { name: '✍️ Draw Signature' }).click();
  await page.locator('canvas').click({
    position: {
      x: 175,
      y: 94
    }
  });
  await page.locator('canvas').dblclick({
    position: {
      x: 228,
      y: 88
    }
  });
  await page.locator('canvas').dblclick({
    position: {
      x: 211,
      y: 106
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 214,
      y: 111
    }
  });
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await page.getByRole('button', { name: 'Archive Training' }).first().click();
  await page.locator('.text-white\\/80').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Make Inactive' }).first().click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Make Inactive' }).first().click();
});
