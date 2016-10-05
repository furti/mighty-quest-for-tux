
Start
 = text:Paragraph { return text}

Paragraph
  = content:Content* {return content.join("") }

Content
 = Text
 / Tag
 / Brackets
 
Brackets
 = [\[\]]
Tag
 = color:StartTag text:Text EndTag { return '<span class="' + color + '">' + text + '</span>'}

StartTag
 = "[" color:Character* "]" { return color.join("") }
 
EndTag
 = "[/"color:Character*"]" { return "" }

Text
 = chars:Character+ { return chars.join("") }
 
Character
 = [^\[\]]