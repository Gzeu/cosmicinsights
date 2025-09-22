const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Security check script for Cosmic Insights
console.log('🔍 Running security checks...');

// Check for common security vulnerabilities in dependencies
try {
    console.log('\n📦 Checking npm audit...');
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const audit = JSON.parse(auditResult);
    
    if (audit.metadata.vulnerabilities.total > 0) {
        console.warn(`⚠️  Found ${audit.metadata.vulnerabilities.total} vulnerabilities:`);
        console.warn(`   - High: ${audit.metadata.vulnerabilities.high}`);
        console.warn(`   - Moderate: ${audit.metadata.vulnerabilities.moderate}`);
        console.warn(`   - Low: ${audit.metadata.vulnerabilities.low}`);
        
        if (audit.metadata.vulnerabilities.high > 0 || audit.metadata.vulnerabilities.critical > 0) {
            console.error('❌ Critical or high severity vulnerabilities found!');
            console.log('Run: npm audit fix');
            process.exit(1);
        }
    } else {
        console.log('✅ No vulnerabilities found in dependencies');
    }
} catch (error) {
    console.error('Error running npm audit:', error.message);
}

// Check for sensitive files that shouldn't be committed
const sensitiveFiles = ['.env', '.env.local', '.env.production'];
const foundSensitiveFiles = [];

sensitiveFiles.forEach(file => {
    if (fs.existsSync(file)) {
        foundSensitiveFiles.push(file);
    }
});

if (foundSensitiveFiles.length > 0) {
    console.warn('\n⚠️  Sensitive files found (should be in .gitignore):');
    foundSensitiveFiles.forEach(file => console.warn(`   - ${file}`));
}

// Check package.json for security best practices
console.log('\n🔒 Checking package.json security...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Check for security-related dependencies
const securityDeps = ['helmet', 'express-rate-limit', 'express-validator'];
const missingSecurityDeps = securityDeps.filter(dep => 
    !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
);

if (missingSecurityDeps.length > 0) {
    console.warn(`⚠️  Missing security dependencies: ${missingSecurityDeps.join(', ')}`);
} else {
    console.log('✅ Security dependencies present');
}

// Check Node.js version requirements
if (packageJson.engines?.node) {
    console.log(`✅ Node.js version constraint: ${packageJson.engines.node}`);
} else {
    console.warn('⚠️  No Node.js version constraint specified');
}

// Check for common security misconfigurations
console.log('\n🛡️  Security configuration checks:');

// Check if .gitignore exists and contains essential entries
if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const essentialEntries = ['node_modules/', '.env', 'logs/', '*.log'];
    const missingEntries = essentialEntries.filter(entry => !gitignore.includes(entry));
    
    if (missingEntries.length > 0) {
        console.warn(`⚠️  .gitignore missing entries: ${missingEntries.join(', ')}`);
    } else {
        console.log('✅ .gitignore properly configured');
    }
} else {
    console.warn('⚠️  No .gitignore file found');
}

// Check for README and basic documentation
if (fs.existsSync('README.md')) {
    console.log('✅ README.md found');
} else {
    console.warn('⚠️  No README.md found');
}

console.log('\n🎯 Security check completed!');
console.log('\nRecommendations:');
console.log('- Keep dependencies updated');
console.log('- Use environment variables for secrets');
console.log('- Enable security headers (helmet)');
console.log('- Implement rate limiting');
console.log('- Validate all user inputs');
console.log('- Use HTTPS in production');
console.log('- Monitor logs for suspicious activity');