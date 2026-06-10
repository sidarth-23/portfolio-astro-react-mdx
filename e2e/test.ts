import { _android as android, expect, test as base } from "@playwright/test"

export const test = base.extend({
  page: async ({ context }, runFixture, testInfo) => {
    const isAndroidProject = testInfo.project.name === "android-real"
    if (!isAndroidProject) {
      const page = await context.newPage()
      await runFixture(page)
      await page.close()
      return
    }

    const devices = await android.devices()
    if (devices.length === 0) {
      throw new Error(
        "No Android device detected. Start emulator/device and ensure `adb devices` lists it."
      )
    }

    const device = devices[0]!
    const deviceContext = await device.launchBrowser()
    const page = await deviceContext.newPage()

    await runFixture(page)

    await page.close()
    await deviceContext.close()
    await device.close()
  },
})

export { expect }
