import re,sys,glob
bad=[]
for f in glob.glob(sys.argv[1]+'/js/**/*.js',recursive=True):
    for n,l in enumerate(open(f).read().split('\n'),1):
        i=l.find("//")
        if l.strip().startswith("//"):continue
        if i<0 or l[:i].count("'")%2 or l[:i].count('`')%2 or 'http' in l[i-6:i+2]:continue
        c=l[i:]
        # code glued onto a comment: "...wordif(", "...word){", ";" followed by identifiers, "=>" etc.
        if re.search(r"[a-z\)](if|for|const|let|return|else)\(|\)\{|;\s*[a-zA-Z_$][\w$.]*\(|=>\{|\}\)\)?;",c):bad.append(f"{f}:{n}: {l.strip()[:160]}")
print('\n'.join(bad) if bad else 'clean')
