import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { FileDropZone } from "@/components/shared/file-drop-zone";
import { toast } from "sonner";
import { FileImage, File } from "lucide-react";

// Helper function to create mock File objects
const createMockFile = (
  name: string,
  type: string,
  size?: number,
  lastModified?: number
): File => {
  const file = {
    name,
    type,
    size: size || name.length,
    lastModified: lastModified || Date.now(),
  } as File;

  return file;
};

// Mock dependencies
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    warning: jest.fn(),
  },
  Toaster: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="toaster">{children}</div>
  ),
}));

jest.mock("react-dropzone", () => ({
  useDropzone: jest.fn(),
}));

const mockUseDropzone = require("react-dropzone").useDropzone as jest.Mock;

describe("FileDropZone", () => {
  const defaultProps = {
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5MB
    placeholder: "Upload your files",
    description: "Max 5MB per file",
    uploadedFiles: [],
  };

  const mockGetRootProps = jest.fn();
  const mockGetInputProps = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for useDropzone
    mockUseDropzone.mockReturnValue({
      getRootProps: mockGetRootProps,
      getInputProps: mockGetInputProps,
      isDragActive: false,
      fileRejections: [],
    });

    mockGetRootProps.mockReturnValue({
      className: "mock-root-props",
    });

    mockGetInputProps.mockReturnValue({
      type: "file",
    });
  });

  describe("Rendering", () => {
    it("should render the drop zone with correct placeholder and description", () => {
      const { container } = render(<FileDropZone {...defaultProps} />);

      expect(screen.getByText("Upload your files")).toBeInTheDocument();
      expect(screen.getByText("Max 5MB per file")).toBeInTheDocument();
      // Check that the component renders successfully
      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render with custom file icon", () => {
      const { container } = render(
        <FileDropZone {...defaultProps} fileIcon={FileImage} />
      );

      // Since we're not uploading files, the icon won't be visible
      // This test ensures the component accepts the fileIcon prop
      expect(container).toBeInTheDocument();
    });

    it("should show toaster component", () => {
      render(<FileDropZone {...defaultProps} />);
      expect(screen.getByTestId("toaster")).toBeInTheDocument();
    });
  });

  describe("Drag and Drop States", () => {
    it("should apply active drag styles when isDragActive is true", () => {
      mockUseDropzone.mockReturnValue({
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
        isDragActive: true,
        fileRejections: [],
      });

      render(<FileDropZone {...defaultProps} />);

      expect(mockGetRootProps).toHaveBeenCalledWith({
        className: expect.stringContaining(
          "border-blue-500 bg-blue-50 dark:bg-blue-950"
        ),
      });
    });

    it("should apply disabled styles when disabled prop is true", () => {
      render(<FileDropZone {...defaultProps} disabled={true} />);

      expect(mockGetRootProps).toHaveBeenCalledWith({
        className: expect.stringContaining("opacity-50 cursor-not-allowed"),
      });
    });

    it("should apply hover styles when not disabled", () => {
      render(<FileDropZone {...defaultProps} disabled={false} />);

      expect(mockGetRootProps).toHaveBeenCalledWith({
        className: expect.stringContaining("cursor-pointer"),
      });
    });
  });

  describe("File Upload Functionality", () => {
    it("should call onFilesChange when files are dropped", () => {
      const mockOnFilesChange = jest.fn();
      const mockFiles = [
        createMockFile("test1.jpg", "image/jpeg"),
        createMockFile("test2.png", "image/png"),
      ];

      let onDropCallback: (files: File[]) => void;

      mockUseDropzone.mockImplementation(
        ({ onDrop }: { onDrop: (files: File[]) => void }) => {
          onDropCallback = onDrop;
          return {
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            isDragActive: false,
            fileRejections: [],
          };
        }
      );

      render(
        <FileDropZone {...defaultProps} onFilesChange={mockOnFilesChange} />
      );

      // Simulate file drop
      act(() => {
        onDropCallback!(mockFiles);
      });

      expect(mockOnFilesChange).toHaveBeenCalledWith(mockFiles);
    });

    it("should filter out duplicate files", () => {
      const mockOnFilesChange = jest.fn();
      const existingFile = createMockFile(
        "existing.jpg",
        "image/jpeg",
        1024,
        1234567890
      );

      const newFile = createMockFile("new.jpg", "image/jpeg");
      const duplicateFile = createMockFile(
        "existing.jpg",
        "image/jpeg",
        1024,
        1234567890
      );

      let onDropCallback: (files: File[]) => void;

      mockUseDropzone.mockImplementation(
        ({ onDrop }: { onDrop: (files: File[]) => void }) => {
          onDropCallback = onDrop;
          return {
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            isDragActive: false,
            fileRejections: [],
          };
        }
      );

      render(
        <FileDropZone
          {...defaultProps}
          onFilesChange={mockOnFilesChange}
          uploadedFiles={[existingFile]}
        />
      );

      // Simulate dropping both new and duplicate files
      act(() => {
        onDropCallback!([newFile, duplicateFile]);
      });

      // Should only include the new file, not the duplicate
      expect(mockOnFilesChange).toHaveBeenCalledWith([existingFile, newFile]);
    });
  });

  describe("File Preview", () => {
    const mockFiles = [
      createMockFile("test1.jpg", "image/jpeg", 1024 * 1024), // 1MB
      createMockFile("test2.png", "image/png", 2 * 1024 * 1024), // 2MB
    ];

    it("should display uploaded files", () => {
      render(<FileDropZone {...defaultProps} uploadedFiles={mockFiles} />);

      expect(screen.getByText("Uploaded Files (2)")).toBeInTheDocument();
      expect(screen.getByText("test1.jpg")).toBeInTheDocument();
      expect(screen.getByText("test2.png")).toBeInTheDocument();
      expect(screen.getByText("1.000 MB")).toBeInTheDocument();
      expect(screen.getByText("2.000 MB")).toBeInTheDocument();
    });

    it("should remove files when delete button is clicked", () => {
      const mockOnFilesChange = jest.fn();

      render(
        <FileDropZone
          {...defaultProps}
          uploadedFiles={mockFiles}
          onFilesChange={mockOnFilesChange}
        />
      );

      const deleteButtons = screen.getAllByRole("button");
      // The first delete button should remove the first file (test1.jpg)
      const firstDeleteButton = deleteButtons[0];

      fireEvent.click(firstDeleteButton);

      // Should contain only the second file (test2.png)
      expect(mockOnFilesChange).toHaveBeenCalledWith([mockFiles[1]]);
    });

    it("should not display file preview section when no files are uploaded", () => {
      render(<FileDropZone {...defaultProps} uploadedFiles={[]} />);

      expect(screen.queryByText(/Uploaded Files/)).not.toBeInTheDocument();
    });
  });

  describe("Error Handling and Notifications", () => {
    it("should show error toast for file size rejection", async () => {
      const rejectedFile = createMockFile(
        "large-file.jpg",
        "image/jpeg",
        10 * 1024 * 1024
      ); // 10MB

      const fileRejections = [
        {
          file: rejectedFile,
          errors: [{ code: "file-too-large", message: "File too large" }],
        },
      ];

      mockUseDropzone.mockReturnValue({
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
        isDragActive: false,
        fileRejections,
      });

      render(<FileDropZone {...defaultProps} />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("1 Upload Failed", {
          description: "File is too large (10.00MB). Max size is 5MB.",
          duration: 4000,
        });
      });
    });

    it("should show error toast for unsupported file type", async () => {
      const rejectedFile = createMockFile("document.pdf", "application/pdf");

      const fileRejections = [
        {
          file: rejectedFile,
          errors: [
            { code: "file-invalid-type", message: "File type not accepted" },
          ],
        },
      ];

      mockUseDropzone.mockReturnValue({
        getRootProps: mockGetRootProps,
        getInputProps: mockGetInputProps,
        isDragActive: false,
        fileRejections,
      });

      render(<FileDropZone {...defaultProps} />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("1 Upload Failed", {
          description: "File type not supported",
          duration: 4000,
        });
      });
    });

    it("should show warning toast for duplicate files", async () => {
      const mockOnFilesChange = jest.fn();
      const existingFile = createMockFile(
        "existing.jpg",
        "image/jpeg",
        1024,
        1234567890
      );

      const duplicateFile = createMockFile(
        "existing.jpg",
        "image/jpeg",
        1024,
        1234567890
      );

      let onDropCallback: (files: File[]) => void;

      mockUseDropzone.mockImplementation(
        ({ onDrop }: { onDrop: (files: File[]) => void }) => {
          onDropCallback = onDrop;
          return {
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            isDragActive: false,
            fileRejections: [],
          };
        }
      );

      render(
        <FileDropZone
          {...defaultProps}
          onFilesChange={mockOnFilesChange}
          uploadedFiles={[existingFile]}
        />
      );

      // Simulate dropping a duplicate file
      act(() => {
        onDropCallback!([duplicateFile]);
      });

      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith("1 Duplicate Skipped", {
          description:
            "Same file is already uploaded. Skipped duplicate upload.",
          duration: 4000,
        });
      });
    });

    it("should show correct plural form for multiple duplicates", async () => {
      const mockOnFilesChange = jest.fn();
      const existingFiles = [
        createMockFile("file1.jpg", "image/jpeg", 1024, 1234567890),
        createMockFile("file2.jpg", "image/jpeg", 1024, 1234567891),
      ];

      const duplicateFiles = [
        createMockFile("file1.jpg", "image/jpeg", 1024, 1234567890),
        createMockFile("file2.jpg", "image/jpeg", 1024, 1234567891),
      ];

      let onDropCallback: (files: File[]) => void;

      mockUseDropzone.mockImplementation(
        ({ onDrop }: { onDrop: (files: File[]) => void }) => {
          onDropCallback = onDrop;
          return {
            getRootProps: mockGetRootProps,
            getInputProps: mockGetInputProps,
            isDragActive: false,
            fileRejections: [],
          };
        }
      );

      render(
        <FileDropZone
          {...defaultProps}
          onFilesChange={mockOnFilesChange}
          uploadedFiles={existingFiles}
        />
      );

      // Simulate dropping duplicate files
      act(() => {
        onDropCallback!(duplicateFiles);
      });

      await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith("2 Duplicates Skipped", {
          description:
            "Same file is already uploaded. Skipped duplicate upload.",
          duration: 4000,
        });
      });
    });
  });

  describe("Props Configuration", () => {
    it("should pass correct props to useDropzone", () => {
      const customProps = {
        ...defaultProps,
        accept: { "application/pdf": [] },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
        disabled: true,
      };

      render(<FileDropZone {...customProps} />);

      expect(mockUseDropzone).toHaveBeenCalledWith(
        expect.objectContaining({
          accept: { "application/pdf": [] },
          maxSize: 10 * 1024 * 1024,
          multiple: false,
          disabled: true,
          onDrop: expect.any(Function),
        })
      );
    });

    it("should use default values for optional props", () => {
      render(<FileDropZone {...defaultProps} />);

      expect(mockUseDropzone).toHaveBeenCalledWith(
        expect.objectContaining({
          multiple: true,
          disabled: false,
        })
      );
    });
  });
});
