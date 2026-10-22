const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const filename=path.join(__dirname,'../lib/public-name.ts');
const compiled=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));loaded._compile(compiled,filename);
const {publicNameError,hasReservedPublicName,PUBLIC_NAME_RESERVED_ERROR}=loaded.exports;
const policy=require('../lib/public-name-policy.json');
test('reserved references are blocked, including decorated and obfuscated forms',()=>{
 const blocked=['Nichiren','Nichiren88','Nichi-ren','N I C H I R E N','Ｎｉｃｈｉｒｅｎ','Nichir3n','Nіchіrеn','Lótō','Lotus_75','Bodhisattva','Bodisatva','Buddha_42','Nam-myoho-renge-kyo','Gohonzon','Daimoku','Gongyo','Gosho','Maitreya','Manjushri','Avalokiteshvara','Soka_Gakkai','日蓮','菩薩','法華経','Zen42'];
 for(const name of blocked)assert.equal(publicNameError(name),PUBLIC_NAME_RESERVED_ERROR,name);
});
test('neutral names and nicknames remain available',()=>{
 for(const name of ['Marco','Nicolò','Anna83','Luca Bianchi','Viandante27','Sole70','Luce','Arianna','Fiori_di_campo'])assert.equal(publicNameError(name),null,name);
});
test('all configured references are enforced, including Unicode spellings',()=>{
 for(const name of [...policy.fragments,...policy.words,...policy.scripts])assert.equal(hasReservedPublicName(name),true,name);
});
test('invalid inputs fail closed and length is checked before saving',()=>{
 for(const name of [undefined,null,17,'',' ','a','---','x'.repeat(61)])assert.ok(publicNameError(name),String(name));
 assert.equal(publicNameError(' Marco '),null);
});
