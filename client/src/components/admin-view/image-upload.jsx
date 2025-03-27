import { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import Cookies from "js-cookie";
import { Checkbox } from "../ui/checkbox";
function UploadProductImage({
  imageFiles,
  setImageFiles,
  imageLoadingStates,
  setImageLoadingStates,
  uploadedImages,
  setUploadedImages,
  isCustomStyle = false,
}) {
  const inputRef = useRef(null);
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);
  function handleImageFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles) setImageFiles(selectedFiles);
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles) setImageFiles(droppedFiles);
  }

  function handleRemoveImage(index) {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingStates(Array(imageFiles.length).fill(true));
    try {
      const token = Cookies.get("token");

      const data = new FormData();
      imageFiles.forEach((file) => {
        data.append("fImages", file);
      });

      const response = await axios.post(
        "https://localhost:44304/api/Admin/AdminProducts/UploadProductImage",
        data,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        const uploadedURLs = response.data.imageUrls.$values;

        setUploadedImages(uploadedURLs);
        setImageLoadingStates(Array(imageFiles.length).fill(false));
      } else {
        console.error("Error uploading images:", response.data);
        setImageLoadingStates(Array(imageFiles.length).fill(false));
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setImageLoadingStates(Array(imageFiles.length).fill(false));
    }
  }

  useEffect(() => {
    if (imageFiles && imageFiles.length > 1) uploadImageToCloudinary();
  }, [imageFiles]);

  return (
    <div className={`w-full mt-4 ${isCustomStyle ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">
        Tải lên hình ảnh
      </Label>
      <Label className="text-lg font-semibold mb-2 block">
        Click chọn hình ảnh
      </Label>
      <Checkbox
        checked={isUpdatingImages}
        onCheckedChange={setIsUpdatingImages}
      ></Checkbox>
      <div
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          multiple
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={!isUpdatingImages}
        />
        {!imageFiles || imageFiles.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isUpdatingImages ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Kéo thả hoặc Nhấn để chọn ảnh</span>
          </Label>
        ) : imageLoadingStates.some((loading) => loading) ? (
          <div>
            {imageLoadingStates.map(
              (loading, index) =>
                loading && (
                  <Skeleton
                    key={index}
                    className="h-10 w-24 bg-gray-100 my-2"
                  />
                )
            )}
          </div>
        ) : (
          <>
            {imageFiles.map((file, index) => (
              <div className="flex items-center justify-between pb-1  ">
                <div className="flex items-center">
                  <FileIcon className="w-8 text-primary mr-2 h-8" />
                </div>
                <p className="text-sm font-medium">{file.name}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveImage(index)}
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Xóa ảnh</span>
                </Button>
                {uploadedImages[index] && (
                  <img
                    src={uploadedImages[index]}
                    alt={file.name}
                    className="w-20 h-20 object-contain"
                  />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default UploadProductImage;
