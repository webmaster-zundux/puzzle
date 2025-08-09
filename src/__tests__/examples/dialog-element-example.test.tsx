import { render, screen } from "@testing-library/react";

test.skip("should find the dialog", async () => {
  render(
    <main>
      <dialog aria-label="want to buy a new car?">dialog text</dialog>
    </main>,
  );

  // await screen.findByRole('dialog') // both jsdom or happy-dom dont have support for findByRole('dialog') for HTMLDialogElement
  await screen.findByLabelText(/want to buy a new car\?/i);

  expect(screen.getByLabelText(/want to buy a new car\?/i)).toBeInTheDocument();
});
