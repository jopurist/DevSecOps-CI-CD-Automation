terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.1.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
    subscription_id = "xxxxxxxxxxxxxxxxxx"
    resource_provider_registrations = "none"
  features {}
}

data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg-internship" {
  name     = "${var.name}-intern"
  location = var.location
  tags   = var.tags
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-${var.location}-intern"
  location            = azurerm_resource_group.rg-internship.location
  resource_group_name = azurerm_resource_group.rg-internship.name
  address_space       = var.vnet_address_space

  subnet {
    name             = "subnet1"
    address_prefixes = ["10.0.1.0/24"]
    security_group = azurerm_network_security_group.NSG.id
  }

  subnet {
    name             = "subnet2"
    address_prefixes = ["10.0.2.0/24"]
  }

    subnet {
    name             = "subnet3"
    address_prefixes = ["10.0.3.0/24"]
  }

  tags = var.tags
}

resource "azurerm_network_security_group" "NSG" {
  name                = "nsg-${var.location}-intern"
  location            = azurerm_resource_group.rg-internship.location
  resource_group_name = azurerm_resource_group.rg-internship.name
  tags = var.tags
}

resource "azurerm_network_security_rule" "Outbound" {
  name                        = "AllowTCPOutbound"
  priority                    = 100
  direction                   = "Outbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.rg-internship.name
  network_security_group_name = azurerm_network_security_group.NSG.name
}

resource "azurerm_network_security_rule" "Inbound" {
  name                        = "AllowTCPInbound"
  priority                    = 200
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.rg-internship.name
  network_security_group_name = azurerm_network_security_group.NSG.name
}

