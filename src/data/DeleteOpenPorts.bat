@echo off

@REM Lists are strings of comma separated values
set game=%~1

set RULE_NAME1=%game%InboundTCP
set RULE_NAME2=%game%OutboundTCP
set RULE_NAME4=%game%InboundUDP
set RULE_NAME3=%game%OutboundUDP


powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME1%' -ErrorAction SilentlyContinue) { Remove-NetFirewallRule -DisplayName '%RULE_NAME1%' } else { Write-Host 'The rule %RULE_NAME1% does not exist.' }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME2%' -ErrorAction SilentlyContinue) { Remove-NetFirewallRule -DisplayName '%RULE_NAME2%' } else { Write-Host 'The rule %RULE_NAME2% does not exist.' }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME3%' -ErrorAction SilentlyContinue) { Remove-NetFirewallRule -DisplayName '%RULE_NAME3%' } else { Write-Host 'The rule %RULE_NAME3% does not exist.' }"
powershell -Command "if (Get-NetFirewallRule -DisplayName '%RULE_NAME4%' -ErrorAction SilentlyContinue) { Remove-NetFirewallRule -DisplayName '%RULE_NAME4%' } else { Write-Host 'The rule %RULE_NAME4% does not exist.' }"

echo Server port rules have been deleted. Feel free to close this window.
pause