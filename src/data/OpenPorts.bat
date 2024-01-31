@echo off

set RULE_NAME1=PalServerInboundTCP
set RULE_NAME2=PalServerOutboundTCP
set RULE_NAME3=PalServerOutboundUDP
set RULE_NAME4=PalServerInboundUDP

set inboundTCPPorts="27015,27016,25575"
set outboundTCPPorts="27015,27016,25575"
set inboundUDPPorts="8211,27015,27016,25575"
set outboundUDPPorts="8211,27015,27016,25575"

powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME1%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME1% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME1%' -Direction Inbound -LocalPort 27015,27016,25575 -Protocol TCP -Action Allow }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME2%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME2% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME2%' -Direction Outbound -LocalPort 27015,27016,25575 -Protocol TCP -Action Allow }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME3%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME3% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME3%' -Direction Outbound -LocalPort 8211,27015,27016,25575 -Protocol UDP -Action Allow }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME4%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME4% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME4%' -Direction Inbound -LocalPort 8211,27015,27016,25575 -Protocol UDP -Action Allow }"

echo Required ports are open. Feel free to close this window and start the server.
pause