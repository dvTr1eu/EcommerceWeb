import { Fragment } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  errors,
}) {
  function renderInputByComponentType(getControllItem) {
    let element = null;
    const value = formData[getControllItem.name] || "";
    switch (getControllItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.name}
            type={getControllItem.type}
            value={value}
            min={0}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value || "",
              })
            }
          />
        );

        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) => {
              setFormData({
                ...formData,
                [getControllItem.name]: value,
              });
            }}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControllItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControllItem.options && getControllItem.options.length > 0
                ? getControllItem.options.map((optionItem) => (
                    <SelectItem
                      className="hover:bg-slate-400 cursor-pointer"
                      key={optionItem.id}
                      value={optionItem.id.toString()}
                    >
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "checkboxInput":
        element = (
          <div className="flex flex-col">
            {getControllItem.options && getControllItem.options.length > 0
              ? getControllItem.options.map((optionItem) => (
                  <div
                    key={optionItem.id}
                    className="flex items-center w-44 justify-between"
                  >
                    <div className="flex font-medium items-center gap-2">
                      <label className="pl-2">{optionItem.sizeName}</label>
                    </div>
                    <div className="w-20">
                      <Input
                        min={0}
                        type="number"
                        value={
                          formData.sizes.find(
                            (size) => size.sizeName === optionItem.sizeName
                          )?.quantity || ""
                        }
                        onChange={(event) => {
                          const value = parseInt(event.target.value, 10) || 0;
                          const updatedSizes = formData.sizes.map((size) =>
                            size.sizeName === optionItem.sizeName
                              ? { ...size, quantity: value }
                              : size
                          );
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            sizes: updatedSizes,
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))
              : null}
          </div>
        );

        break;

      case "checkbox":
        element = (
          <Checkbox
            checked={value}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, [getControllItem.name]: checked })
            }
          />
        );

        break;
      default:
        element = (
          <Input
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.name}
            type={getControllItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value || "",
              })
            }
          />
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputByComponentType(controlItem)}
            {errors && errors[controlItem.name] && (
              <p className="text-red-500 text-sm">{errors[controlItem.name]}</p>
            )}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
