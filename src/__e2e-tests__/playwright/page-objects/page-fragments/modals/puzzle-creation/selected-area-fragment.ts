import { expect, type Locator, type Page } from "@playwright/test";
import { mouseMove } from "../../../../utils/mouse-move";
import { type PageFragment } from "../../page-fragment";
import { getFullUrlForRelativeUrl } from "../../../../utils/get-full-url-for-relative-url";
import { RELATIVE_URL_DEMO_IMAGE_1920x1080 } from "../../../puzzle-page";

export class SelectedAreaFragment implements PageFragment {
  readonly page: Page;

  readonly getSelectedArea: Locator;

  readonly getPreviewImage: Locator;
  readonly getAvailableToSelectAreaOfImage: Locator;
  readonly getSelectedAreaBorder: Locator;
  readonly getPiecesBorders: Locator;

  readonly getTopLeftCornerControlPoint: Locator;
  readonly getTopRightCornerControlPoint: Locator;
  readonly getBottomRightCornerControlPoint: Locator;
  readonly getBottomLeftCornerControlPoint: Locator;

  readonly getTopSideControlPoint: Locator;
  readonly getRightSideControlPoint: Locator;
  readonly getBottomSideControlPoint: Locator;
  readonly getLeftSideControlPoint: Locator;

  readonly getCenterControlPoint: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getSelectedArea = page
      .getByRole("img", { name: /preview of the puzzle cut into pieces/i })
      .locator("xpath=..");
    const base = this.getSelectedArea;

    this.getPreviewImage = base.getByRole("img", { name: /preview of the puzzle cut into pieces/i });
    this.getAvailableToSelectAreaOfImage = this.page.getByLabel(/available to select area of image/i);
    this.getSelectedAreaBorder = base.getByRole("img", { name: /selected area border/i });
    this.getPiecesBorders = base.getByRole("img", { name: /pieces borders/i });

    this.getTopLeftCornerControlPoint = base.getByRole("button", { name: /top left corner control point/i });
    this.getTopRightCornerControlPoint = base.getByRole("button", { name: /top right corner control point/i });
    this.getBottomRightCornerControlPoint = base.getByRole("button", { name: /bottom right corner control point/i });
    this.getBottomLeftCornerControlPoint = base.getByRole("button", { name: /bottom left corner control point/i });

    this.getTopSideControlPoint = base.getByRole("button", { name: /top side control point/i });
    this.getRightSideControlPoint = base.getByRole("button", { name: /right side control point/i });
    this.getBottomSideControlPoint = base.getByRole("button", { name: /bottom side control point/i });
    this.getLeftSideControlPoint = base.getByRole("button", { name: /left side control point/i });

    this.getCenterControlPoint = base.getByRole("button", { name: /center control point/i });
  }

  async isVisible() {
    await expect(this.getPreviewImage).toBeVisible();
    await expect(this.getAvailableToSelectAreaOfImage).toBeVisible();
    await expect(this.getSelectedAreaBorder).toBeVisible();
    await expect(this.getPiecesBorders).toBeVisible();
    await expect(this.getTopLeftCornerControlPoint).toBeVisible();
    await expect(this.getTopRightCornerControlPoint).toBeVisible();
    await expect(this.getBottomRightCornerControlPoint).toBeVisible();
    await expect(this.getBottomLeftCornerControlPoint).toBeVisible();
    await expect(this.getTopSideControlPoint).toBeVisible();
    await expect(this.getRightSideControlPoint).toBeVisible();
    await expect(this.getBottomSideControlPoint).toBeVisible();
    await expect(this.getLeftSideControlPoint).toBeVisible();
    await expect(this.getCenterControlPoint).toBeVisible();
  }

  async moveControlPoint(controlPoint: Locator, targetPosition: { x: number; y: number }) {
    await mouseMove(this.page, controlPoint, targetPosition);
  }

  async moveControlPointByDelta(controlPoint: Locator, positionDelta: { x: number; y: number }) {
    const pointPosition = await controlPoint.boundingBox();
    expect(pointPosition).not.toBe(null);
    await this.moveControlPoint(controlPoint, {
      x: pointPosition!.x + positionDelta.x,
      y: pointPosition!.y + positionDelta.y,
    });
  }

  async calculateBoundingClientRect() {
    return await this.getSelectedAreaBorder.evaluate((element) => element.getBoundingClientRect());
  }

  async hasPreviewImageRelativeSrcOfDemoImage1920x1080() {
    await expect(this.getPreviewImage).toHaveAttribute(
      "src",
      getFullUrlForRelativeUrl(this.page, RELATIVE_URL_DEMO_IMAGE_1920x1080),
    );
  }

  async hasSelectedAreaTheSameAsDemoPuzzle2x1ForDemoImage1920x1080() {
    expect(await this.calculateBoundingClientRect()).toMatchObject({
      height: expect.closeTo(310, 0),
      width: expect.closeTo(624, 0),
      x: expect.closeTo(152, 0),
      y: expect.closeTo(146, 0),
    });
  }

  async hasSelectedAreaTheSameAsDemoPuzzle7x4ForDemoImage1920x1080() {
    expect(await this.calculateBoundingClientRect()).toMatchObject({
      height: expect.closeTo(0, 0),
      width: expect.closeTo(0, 0),
      x: expect.closeTo(0, 0),
      y: expect.closeTo(0, 0),
    });
  }

  async hasSelectedAreaTheSameAsOriginalDemoImage1920x1080() {
    expect(await this.calculateBoundingClientRect()).toMatchObject({
      height: expect.closeTo(350, 0),
      width: expect.closeTo(624, 0),
      x: expect.closeTo(152, 0),
      y: expect.closeTo(107, 0),
    });
  }

  async hasSelectedAreaTheSameAsOriginalDemoImage250x250() {
    expect(await this.calculateBoundingClientRect()).toMatchObject({
      height: expect.closeTo(252, 0),
      width: expect.closeTo(252, 0),
      x: expect.closeTo(338, 0),
      y: expect.closeTo(107, 0),
    });
  }
}
