# Create a firewall group
resource "vultr_firewall_group" "my_firewall_group" {
  description = "Firewall - Interview"
}

# # Allow SSH (port 22) from any IP
# resource "vultr_firewall_rule" "ssh" {
#   firewall_group_id = vultr_firewall_group.my_firewall_group.id
#   protocol          = "tcp"
#   ip_type           = "v4"
#   subnet            = "0.0.0.0"
#   subnet_size       = 0
#   port              = "22"
#   notes             = "Allow SSH from any IP"
# }

# Allow port 2424
resource "vultr_firewall_rule" "ssh" {
  firewall_group_id = vultr_firewall_group.my_firewall_group.id
  protocol          = "tcp"
  ip_type           = "v4"
  subnet            = "0.0.0.0"
  subnet_size       = 0
  port              = "2424"
  notes             = ""
}

/*  */
/*  */
/*  */

# Allow HTTP (port 80) from all Cloudflare IPv4 ranges
resource "vultr_firewall_rule" "http_ipv4_80" {
  firewall_group_id = vultr_firewall_group.my_firewall_group.id
  protocol          = "tcp"
  ip_type           = "v4"
  port              = "80"
  subnet            = "0.0.0.0"
  subnet_size       = 0
  notes             = "Allow HTTP from Cloudflare IPv4"
  source            = "cloudflare"
}

# Allow HTTP (port 443) from all Cloudflare IPv4 ranges
resource "vultr_firewall_rule" "http_ipv4_443" {
  firewall_group_id = vultr_firewall_group.my_firewall_group.id
  protocol          = "tcp"
  ip_type           = "v4"
  port              = "443"
  subnet            = "0.0.0.0"
  subnet_size       = 0
  notes             = "Allow HTTP from Cloudflare IPv4"
  source            = "cloudflare"
}

# Allow HTTP (port 80) from all Cloudflare IPv6 ranges
resource "vultr_firewall_rule" "http_ipv6_80" {
  firewall_group_id = vultr_firewall_group.my_firewall_group.id
  protocol          = "tcp"
  ip_type           = "v6"
  port              = "80"
  subnet            = "0.0.0.0"
  subnet_size       = 0
  notes             = "Allow HTTP from Cloudflare IPv4"
  source            = "cloudflare"
}

# Allow HTTP (port 443) from all Cloudflare IPv6 ranges
resource "vultr_firewall_rule" "http_ipv6_443" {
  firewall_group_id = vultr_firewall_group.my_firewall_group.id
  protocol          = "tcp"
  ip_type           = "v6"
  port              = "443"
  subnet            = "0.0.0.0"
  subnet_size       = 0
  notes             = "Allow HTTP from Cloudflare IPv4"
  source            = "cloudflare"
}