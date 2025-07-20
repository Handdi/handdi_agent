const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}
╔═══════════════════════════════════════════╗
║    Handdi.io Dashboard Setup Wizard       ║
╚═══════════════════════════════════════════╝
${colors.reset}`);

// Check if .env.local already exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log(`${colors.yellow}⚠️  .env.local file already exists!${colors.reset}`);
  rl.question('Do you want to overwrite it? (y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log(`${colors.blue}Setup cancelled.${colors.reset}`);
      rl.close();
      return;
    }
    createEnvFile();
  });
} else {
  createEnvFile();
}

function createEnvFile() {
  console.log(`\n${colors.green}Let's set up your Airtable credentials:${colors.reset}\n`);
  
  // Get Airtable credentials from user
  rl.question('Enter your Airtable API Key: ', (apiKey) => {
    rl.question('Enter your Airtable Base ID: ', (baseId) => {
      rl.question('Enter your Airtable Table Name (default: Agents): ', (tableName) => {
        
        // Use default table name if not provided
        const finalTableName = tableName.trim() || 'Agents';
        
        // Create .env.local content
        const envContent = `# Airtable Configuration
AIRTABLE_API_KEY=${apiKey.trim()}
AIRTABLE_BASE_ID=${baseId.trim()}
AIRTABLE_TABLE_NAME=${finalTableName}
`;
        
        // Write to .env.local file
        fs.writeFileSync(envPath, envContent);
        
        console.log(`\n${colors.green}✅ .env.local file created successfully!${colors.reset}`);
        console.log(`\n${colors.blue}Next steps:${colors.reset}`);
        console.log('1. Run: npm install');
        console.log('2. Run: npm run dev');
        console.log('3. Open: http://localhost:3000');
        console.log(`\n${colors.yellow}Remember: Never commit .env.local to version control!${colors.reset}`);
        
        rl.close();
      });
    });
  });
}

// Handle script termination
rl.on('close', () => {
  console.log(`\n${colors.blue}Setup wizard closed.${colors.reset}`);
  process.exit(0);
}); 