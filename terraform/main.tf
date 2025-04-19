terraform {
  required_providers {
    vultr = {
      source  = "vultr/vultr"
      version = "2.23.1"
    }
  }
}

# Configure the Vultr provider
provider "vultr" {
  api_key = var.vultr_api_key
}

resource "vultr_ssh_key" "my_ssh_key" {
  name    = "my-ssh-key"                  # Name for the SSH key
  ssh_key = file("${path.root}/keys.pub") # Path to your public SSH key file
}

# Create a Vultr instance
resource "vultr_instance" "my_instance" {
  plan        = "vhf-1c-1gb"                     # High freciency 1core 1GB
  region      = "sjc"                            # Sillicon Valley
  os_id       = 2136                             # Debian 12
  label       = "standalone-api-terraform-vultr" # Label for the instance
  hostname    = "standalone-api-terraform-vultr" # Hostname for the instance
  enable_ipv6 = true                             # Enable IPv6
  backups     = "disabled"                       # Enable or disable backups
  tags        = ["terraform", "interview"]       # Tags for the instance

  ssh_key_ids       = [vultr_ssh_key.my_ssh_key.id]             # Associate the SSH key with the instance
  firewall_group_id = vultr_firewall_group.my_firewall_group.id # Associate the firewall group
}

# Output the instance IP address
output "instance_ip" {
  value = vultr_instance.my_instance.main_ip
}

# Output the SSH key ID
output "ssh_key_id" {
  value = vultr_ssh_key.my_ssh_key.id
}

# Output the firewall group ID
output "firewall_group_id" {
  value = vultr_firewall_group.my_firewall_group.id
}
