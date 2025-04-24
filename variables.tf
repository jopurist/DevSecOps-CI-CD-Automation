variable "name" {
  description = "Name of the resource group"
  type        = string
  default     = "internship"
}

variable "location" {
  description = "Location of the resource group"
  type        = string
  default     = "southeastasia"
}

variable "tags" {
  type = map(string)
  default = {
    CreateDate = "23-Apr-2025"
  }
}

variable "vnet_address_space" {
  type    = list(string)
  default = ["10.0.0.0/16"]
}