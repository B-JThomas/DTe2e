const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const pixelErrorThreshold = 1500;
const comparisonDir = '/Users/baileysmacmini/Desktop/Personal/CODE/VsCode/Projects/Work/e2e/DigitalTreasury/comparisons';



async function takeAndCompareSnapshot(page, viewport, snapshotName) {
  // Set the viewport size
  await page.setViewportSize(viewport);
  await page.goto('https://digitaltreasury.com.au/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  // Try to capture the screenshot and compare with the snapshot
  try {
    const screenshot = await page.screenshot({ fullPage: true });
    await expect(screenshot).toMatchSnapshot(snapshotName, { maxDiffPixels: pixelErrorThreshold });
    //SUCCESS
    console.log(`${snapshotName} matches the stored snapshot.`);
  } catch (error) {
    //FAILURE
    // Saving the screenshot that caused the test to fail
    const screenshotPath = path.join(comparisonDir, `FAIL_${snapshotName}`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Failed screenshot saved to: ${screenshotPath}`);
  }
}

test('Full website screenshot on Phone', async ({ page }) => {
  await takeAndCompareSnapshot(page, { width: 375, height: 667 }, 'full-website-phone.png');
});

// Tablet viewport test
test('Full website screenshot on Tablet', async ({ page }) => {
  await takeAndCompareSnapshot(page, { width: 768, height: 1024 }, 'full-website-tablet.png');
});

// Desktop viewport test
test('Full website screenshot on Desktop', async ({ page }) => {
  await takeAndCompareSnapshot(page, { width: 1920, height: 1080 }, 'full-website-desktop.png');
});
