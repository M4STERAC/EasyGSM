@echo off

@REM Lists are strings of comma separated values
set game=%~1
set inboundTCPPorts=%~2
set outboundTCPPorts=%~3
set inboundUDPPorts=%~4
set outboundUDPPorts=%~5

set RULE_NAME1=%game%InboundTCP
set RULE_NAME2=%game%OutboundTCP
set RULE_NAME4=%game%InboundUDP
set RULE_NAME3=%game%OutboundUDP


powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME1%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME1% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME1%' -Direction Inbound -LocalPort 27015,27016,25575 -Protocol TCP -Action Allow }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME2%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME2% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME2%' -Direction Outbound -LocalPort 27015,27016,25575 -Protocol TCP -Action Allow }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME3%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME3% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME3%' -Direction Outbound -LocalPort 8211,27015,27016,25575 -Protocol UDP -Action Allow }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME4%' -ErrorAction SilentlyContinue) { Write-Host 'The rule %RULE_NAME4% already exists.' } else { New-NetFirewallRule -DisplayName '%RULE_NAME4%' -Direction Inbound -LocalPort 8211,27015,27016,25575 -Protocol UDP -Action Allow }"

echo Required ports are open. Feel free to close this window and start the server.
pause