import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FileUploader } from "./file-uploader";

function makeFile(name: string, bytes: number) {
  return new File([new Uint8Array(bytes)], name, { type: "application/pdf" });
}

describe("FileUploader", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the file size and a loading state until the upload finishes", async () => {
    vi.useFakeTimers();
    const onFilesChange = vi.fn();
    const { container } = render(<FileUploader onFilesChange={onFilesChange} />);
    const input = container.querySelector('input[type="file"]');
    if (!input) throw new Error("Missing file input");

    fireEvent.change(input, { target: { files: [makeFile("receipt.pdf", 2048)] } });

    expect(screen.getByText("receipt.pdf")).toBeInTheDocument();
    expect(screen.getByText("2.0 KB · Uploading")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Uploading receipt.pdf" })).toBeInTheDocument();
    expect(onFilesChange).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500);
    });

    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
    expect(screen.queryByText(/Uploading/)).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(onFilesChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: "receipt.pdf" }),
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Remove receipt.pdf" }));

    expect(screen.queryByText("receipt.pdf")).not.toBeInTheDocument();
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });
});
