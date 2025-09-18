#!/bin/bash

# Test script for IPv4 fixes in all installation scripts
# This script verifies that all scripts now use IPv4 instead of IPv6

echo "🧪 Testing IPv4 fixes in all installation scripts..."
echo ""

# Test the IPv4 detection function
test_ipv4_detection() {
    echo "🔍 Testing IPv4 detection logic..."
    
    # Test the actual command used in scripts
    SERVER_IP=$(curl -s -4 ifconfig.me 2>/dev/null || curl -s ipv4.icanhazip.com 2>/dev/null || hostname -I | grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' | head -1)
    
    if [[ $SERVER_IP =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        echo "✅ IPv4 detection working: $SERVER_IP"
        return 0
    else
        echo "❌ IPv4 detection failed: $SERVER_IP"
        return 1
    fi
}

# Test each script for IPv4 fixes
test_script_fixes() {
    local script_name="$1"
    local script_path="$2"
    
    echo ""
    echo "🔍 Testing $script_name..."
    
    if [ ! -f "$script_path" ]; then
        echo "❌ Script not found: $script_path"
        return 1
    fi
    
    # Check for IPv4 forcing flag
    if grep -q "curl -s -4 ifconfig.me" "$script_path"; then
        echo "✅ IPv4 forcing (-4 flag) found"
    else
        echo "❌ IPv4 forcing (-4 flag) not found"
        return 1
    fi
    
    # Check for IPv4 regex filtering
    if grep -q "grep -oE.*[0-9]{1,3}" "$script_path"; then
        echo "✅ IPv4 regex filtering found"
    else
        echo "❌ IPv4 regex filtering not found"
        return 1
    fi
    
    # Check for alternative IPv4 service
    if grep -q "ipv4.icanhazip.com" "$script_path"; then
        echo "✅ Alternative IPv4 service found"
    else
        echo "❌ Alternative IPv4 service not found"
        return 1
    fi
    
    echo "✅ $script_name has all IPv4 fixes"
    return 0
}

# Run IPv4 detection test
test_ipv4_detection
ipv4_test_result=$?

# Test all scripts
scripts_tested=0
scripts_passed=0

# Test install-vps.sh
test_script_fixes "install-vps.sh" "install-vps.sh"
if [ $? -eq 0 ]; then
    ((scripts_passed++))
fi
((scripts_tested++))

# Test quick-install.sh
test_script_fixes "quick-install.sh" "quick-install.sh"
if [ $? -eq 0 ]; then
    ((scripts_passed++))
fi
((scripts_tested++))

# Test install.sh
test_script_fixes "install.sh" "install.sh"
if [ $? -eq 0 ]; then
    ((scripts_passed++))
fi
((scripts_tested++))

# Test test-automafy-web.sh
test_script_fixes "test-automafy-web.sh" "test-automafy-web.sh"
if [ $? -eq 0 ]; then
    ((scripts_passed++))
fi
((scripts_tested++))

echo ""
echo "📊 Test Summary:"
echo "  • IPv4 Detection Test: $([ $ipv4_test_result -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "  • Scripts Tested: $scripts_tested"
echo "  • Scripts Passed: $scripts_passed"
echo "  • Scripts Failed: $((scripts_tested - scripts_passed))"

echo ""
if [ $ipv4_test_result -eq 0 ] && [ $scripts_passed -eq $scripts_tested ]; then
    echo "🎉 All tests PASSED! IPv4 fixes are working correctly."
    echo ""
    echo "✅ Fixed Issues:"
    echo "  • All scripts now force IPv4 detection with -4 flag"
    echo "  • Added alternative IPv4 service (ipv4.icanhazip.com)"
    echo "  • Added IPv4 regex filtering to exclude IPv6"
    echo "  • Improved error handling with 2>/dev/null"
    echo ""
    echo "🚀 Now all scripts will show IPv4 addresses like:"
    echo "  • AutomaFy Web: http://192.168.1.100:3000"
    echo "  • Portainer: http://192.168.1.100:9000"
    echo "  • Instead of IPv6 like: http://2a02:c207:2281:3415::1:3000"
else
    echo "❌ Some tests FAILED. Please check the issues above."
fi

echo ""