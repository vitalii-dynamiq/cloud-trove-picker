
import { FilePicker } from "@/components/FilePicker";

// Mock data and functions for demonstration
const mockData = {
  root: [
    {
      id: "1",
      name: "Documents",
      isDirectory: true,
      updatedAt: new Date().toISOString(),
      updatedBy: "John Doe"
    },
    {
      id: "2",
      name: "Images",
      isDirectory: true,
      updatedAt: new Date().toISOString(),
      updatedBy: "Jane Smith"
    },
    {
      id: "3",
      name: "report.pdf",
      size: 1024 * 1024 * 2.5, // 2.5MB
      fileType: "text",
      updatedAt: new Date().toISOString(),
      updatedBy: "John Doe"
    }
  ],
  "1": [
    {
      id: "4",
      name: "Project Specs.docx",
      size: 1024 * 512, // 512KB
      fileType: "text",
      updatedAt: new Date().toISOString(),
      updatedBy: "Jane Smith"
    }
  ],
  "2": [
    {
      id: "5",
      name: "profile.jpg",
      size: 1024 * 1024 * 1.2, // 1.2MB
      fileType: "image",
      updatedAt: new Date().toISOString(),
      updatedBy: "John Doe"
    }
  ]
};

const Index = () => {
  const fetchDataForDirectory = async (directoryId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockData[directoryId as keyof typeof mockData] || [];
  };

  const handleSelectionChange = (selectedItems: any[]) => {
    console.log("Selected items:", selectedItems);
  };

  const handleError = (error: Error) => {
    console.error("Error fetching data:", error);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">File Browser</h1>
      <FilePicker
        connectionId="demo-connection"
        onFetchData={fetchDataForDirectory}
        onSelectionChange={handleSelectionChange}
        onError={handleError}
      />
    </div>
  );
};

export default Index;
