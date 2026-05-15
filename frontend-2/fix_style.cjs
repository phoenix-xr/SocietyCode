const fs = require('fs');
let code = fs.readFileSync('src/Game.jsx', 'utf8');
const lines = code.split('\n');

// Find the broken fragment: lines 1140-1148 (0-indexed: 1139-1147)
// Should be:
//   <>
//     <style>
//       {`
//         @keyframes fadeInUpText {
//           0% { opacity: 0; transform: translateY(20px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeInButton {
//           0% { opacity: 0; }
//           100% { opacity: 1; }
//         }
//       `}
//     </style>

// Find the broken block by looking for the fragment start 
const brokenStart = '            \n                100% { opacity: 1; transform: translateY(0); }\n                }\n                @keyframes fadeInButton {\n                  0% { opacity: 0; }\n                  100% { opacity: 1; }\n                }\n              `}\n            </style>';
const fixed = '            <style>\n              {`\n                @keyframes fadeInUpText {\n                  0% { opacity: 0; transform: translateY(20px); }\n                  100% { opacity: 1; transform: translateY(0); }\n                }\n                @keyframes fadeInButton {\n                  0% { opacity: 0; }\n                  100% { opacity: 1; }\n                }\n              `}\n            </style>';

// Also check for the fragment where the <> is still correct
// Find line index 1139 (0-indexed) which is "            "
// and line 1140 = "                100% { opacity: 1; ..."
// We need to join around the broken fragment  

const idx = code.indexOf('                100% { opacity: 1; transform: translateY(0); }\n                }\n                @keyframes fadeInButton');
if (idx !== -1) {
    // Go back to find where this broken fragment starts
    const beforeFrag = code.lastIndexOf('\n', idx - 2);
    const fragStart = beforeFrag + 1; // start of the blank/partial line before "100%..."
    
    // Find the end: after </style>
    const styleEnd = code.indexOf('</style>', idx) + '</style>'.length;
    
    console.log('Fragment from char:', fragStart, 'to:', styleEnd);
    console.log('Fragment:', JSON.stringify(code.substring(fragStart, styleEnd)));
    
    const replacement = '            <style>\n              {`\n                @keyframes fadeInUpText {\n                  0% { opacity: 0; transform: translateY(20px); }\n                  100% { opacity: 1; transform: translateY(0); }\n                }\n                @keyframes fadeInButton {\n                  0% { opacity: 0; }\n                  100% { opacity: 1; }\n                }\n              `}\n            </style>';
    code = code.substring(0, fragStart) + replacement + code.substring(styleEnd);
    fs.writeFileSync('src/Game.jsx', code);
    console.log('Fixed!');
} else {
    console.log('Fragment not found');
}
